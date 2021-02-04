var roleRepairer = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.repairing = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
      creep.memory.repairing = true;
      creep.say("🔧 repair");
    }

    if (creep.memory.repairing) {
      // Logic for repairing
      var priorityrepair = creep.memory.priorityrepair;
      switch (priorityrepair) {
        case "wall":
          // Wall Code
          this.priorityRun(
            ["repairWalls", "repairContainers", "repairRoads", "repairTowers"],
            creep
          );
          break;
        case "container":
          //Container code
          this.priorityRun(
            ["repairContainers", "repairWalls", "repairTowers", "repairRoads"],
            creep
          );
          break;
        case "tower":
          //Tower code
          this.priorityRun(
            ["repairTowers", "repairContainers", "repairRoads", "repairWalls"],
            creep
          );
          break;
        case "road":
          //Road code
          this.priorityRun(
            ["repairRoads", "repairWalls", "repairContainers", "repairTowers"],
            creep
          );
          break;
        default:
          // Repair everything fallback
          this.repairEverything(creep);
          break;
      }
    } else {
      // Logic for getting energy
      this.withdrawEnergy(creep);
    }
  },
  repairWalls: function (creep) {
    // Function to repair walls & Ramparts
    var wallTargets = creep.room.find(FIND_STRUCTURES, {
      filter: (w) =>
        (w.structureType == STRUCTURE_WALL ||
          w.structureType == STRUCTURE_RAMPART) &&
        w.hits < 50000,
    }); // Only show walls that are below 50k
    //wallTargets.sort((a, b) => a.hits - b.hits);
    if (wallTargets.length > 0) {
      if (creep.repair(wallTargets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(wallTargets[0], {
          visualizePathStyle: { stroke: "#ff0000" },
        });
        creep.say("Walls");
        return true;
      }
    } else {
      return false;
    }
  },
  repairContainers: function (creep) {
    // Function to repair containers
    var containerTargets = creep.room.find(FIND_STRUCTURES, {
      filter: (object) =>
        object.structureType == STRUCTURE_CONTAINER &&
        object.hits < object.hitsMax,
    });

    //containerTargets.sort((a, b) => a.hits - b.hits);

    if (containerTargets.length > 0) {
      if (creep.repair(containerTargets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(containerTargets[0], {
          visualizePathStyle: { stroke: "#ff0000" },
        });
        creep.say("Containers");
        return true;
      }
    } else {
      return false;
    }
  },
  repairTowers: function (creep) {
    // Function is to repair towers only
    var towerTargets = creep.room.find(FIND_STRUCTURES, {
      filter: (w) => w.structureType == STRUCTURE_TOWER && w.hits < w.hitsMax,
    });
    //towerTargets.sort((a, b) => a.hits - b.hits);
    if (towerTargets.length > 0) {
      if (creep.repair(towerTargets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(towerTargets[0], {
          visualizePathStyle: { stroke: "#ff0000" },
        });
        creep.say("Towers");
        return true;
      }
    } else {
      return false;
    }
  },
  repairRoads: function (creep) {
    // Function is to repair roads only
    var roadTargets = creep.room.find(FIND_STRUCTURES, {
      filter: (w) => w.structureType == STRUCTURE_ROAD && w.hits < w.hitsMax,
    });
    //roadTargets.sort((a, b) => a.hits - b.hits);
    if (roadTargets.length > 0) {
      if (creep.repair(roadTargets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(roadTargets[0], {
          visualizePathStyle: { stroke: "#ff0000" },
        });
        creep.say("Roads");
        return true;
      }
    } else {
      return false;
    }
  },
  repairEverything: function (creep) {
    // Fallback function to repair anything that needs it
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (object) =>
        object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL,
    });

    //targets.sort((a, b) => a.hits - b.hits);

    if (targets.length > 0) {
      if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], {
          visualizePathStyle: { stroke: "#ff0000" },
        });
      }
    }
  },
  withdrawEnergy: function (creep) {
    // to allow the repairer to withdraw energy
    var energySource = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => {
        return (
          (s.structureType == STRUCTURE_STORAGE ||
            s.structureType == STRUCTURE_CONTAINER) &&
          s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        );
      },
    });

    if (creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(energySource, {
        visualizePathStyle: { stroke: "#aa0000" },
      });
    }
  },
  priorityRun: function (priority, creep) {
    if (this[priority[0]](creep)) {
      //console.log(creep.name + " - Priority 1");
      return 1;
    }

    if (this[priority[1]](creep)) {
      //console.log(creep.name + " - Priority 2");
      return 2;
    }

    if (this[priority[2]](creep)) {
      //console.log(creep.name + " - Priority 3");
      return 3;
    }

    if (this[priority[3]](creep)) {
      //console.log(creep.name + " - Priority 4");
      return 4;
    } else {
      this.repairEverything(creep);
      //console.log(creep.name + " - anything else");
    }
  },
};

module.exports = roleRepairer;
