const mongoose = require("mongoose");
const calculateSpeed = require("../../utils/calculateReportSpeed");
const compareSopDuration = async function (next) {
  try {
    const sop = await mongoose.model("Sop").findById(this.sop);
    if (!sop) {
      throw new Error("Referenced Sop not found");
    }
    const originalDuration = this.duration;
    const estimatedDuration = sop.duration;

    this.progress !== 100
      ? (this.speed = -3)
      : (this.speed = calculateSpeed(originalDuration, estimatedDuration));
    this.category = sop.category;

    for (const step of this.steps) {
      const originalStep = await mongoose.model("Step").findById(step.step);
      if (!originalStep) {
        throw new Error("Referenced Step not found");
      }
      console.log(originalStep, "original");
      if (originalStep.finish === true && step.duration > 0) {
        this.finished = true;
      }
      console.log(step, "actual step");
      if (step.substeps && step.substeps.length > 0) {
        const allSubstepsCompleted = step.substeps.every(
          (substep) => substep.duration > 0
        );
        if (allSubstepsCompleted) {
          const aggregatedSubstepTime = step.substeps.reduce(
            (total, substep) => total + substep.duration,
            0
          );
          step.speed = calculateSpeed(
            aggregatedSubstepTime,
            originalStep.duration
          );
        } else {
          step.speed = -3;
        }
      } else {
        const stepOriginalDuration = step.duration;
        stepOriginalDuration === 0
          ? (step.speed = -3)
          : (step.speed = calculateSpeed(
              stepOriginalDuration,
              originalStep.duration
            ));
      }
      if (step.substeps && step.substeps.length > 0) {
        this.finished = false;
        for (const substep of step.substeps) {
          const originalSubstep = await mongoose
            .model("Substep")
            .findById(substep.substep);
          if (!originalSubstep) {
            throw new Error("Referenced Substep not found");
          }
          if (originalSubstep.finish === true && substep.duration > 0) {
            this.finished = true;
          }
          const substepOriginalDuration = substep.duration;
          const substepEstimatedDuration = originalSubstep.duration;
          substepOriginalDuration === 0
            ? (substep.speed = -3)
            : (substep.speed = calculateSpeed(
                substepOriginalDuration,
                substepEstimatedDuration
              ));
        }
      }
    }
    if (
      this.finished &&
      this.category === "Maintenance" &&
      mongoose.Types.ObjectId.isValid(this.mfn)
    ) {
      const event = await mongoose
        .model("Event")
        .findById(new mongoose.Types.ObjectId(this.mfn));
      if (event) {
        event.status = "Completed";
        await event.save();
      }
    } else if (
      this.finished === false &&
      this.category === "Maintenance" &&
      mongoose.Types.ObjectId.isValid(this.mfn)
    ) {
      const event = await mongoose
        .model("Event")
        .findById(new mongoose.Types.ObjectId(this.mfn));
      if (event) {
        event.status = "Ongoing";
        await event.save();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = compareSopDuration;
