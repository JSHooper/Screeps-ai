var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    var upgraderContainerId = "14ae3ebd257b06f";

    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say("⚡ upgrade");
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    } else {
      var containers = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => {
          return (
            s.structureType == STRUCTURE_CONTAINER &&
            s.id == upgraderContainerId
          );
        },
      });
      if (containers.length > 0) {
        if (
          creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(containers[0], {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
        }
      }
    }
  },
};

module.exports = roleUpgrader;
