/*
Hauler will keep source containers from being full

Main Priority:
    1. Move source container to storage 
TODO:

*/

var sourceContainerID = "7cb954f339252e6";
var upgraderContainerId = "14ae3ebd257b06f";

var roleHauler = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.transferring && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.transferring = false;
      creep.say("🔄 withdraw");
    }
    if (!creep.memory.transferring && creep.store.getFreeCapacity() == 0) {
      creep.memory.transferring = true;
      creep.say("🚧 transfer");
    }

    var storages = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        return s.structureType == STRUCTURE_STORAGE;
      },
    });
    var spawn = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        return (
          s.structureType == STRUCTURE_SPAWN &&
          s.store.getUsedCapacity(RESOURCE_ENERGY) < 299
        );
      },
    });
    var extensions = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        return (
          s.structureType == STRUCTURE_EXTENSION &&
          s.store.getUsedCapacity(RESOURCE_ENERGY) < 49
        );
      },
    });
    var upgradeContainers = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        return (
          s.structureType == STRUCTURE_CONTAINER &&
          s.id == upgraderContainerId &&
          s.store.getUsedCapacity(RESOURCE_ENERGY) < 1000
        );
      },
    });
    var towers = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        return (
          s.structureType == STRUCTURE_TOWER &&
          s.store.getUsedCapacity(RESOURCE_ENERGY) < 999
        );
      },
    });

    if (creep.memory.transferring) {
      if (spawn.length > 0) {
        if (creep.transfer(spawn[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(spawn[0], {
            visualizePathStyle: { stroke: "#0000ff" },
          });
        }
      } else if (extensions.length > 0) {
        if (
          creep.transfer(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(extensions[0], {
            visualizePathStyle: { stroke: "#0000ff" },
          });
        }
      } else if (upgradeContainers.length > 0) {
        if (
          creep.transfer(upgradeContainers[0], RESOURCE_ENERGY) ==
          ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(upgradeContainers[0], {
            visualizePathStyle: { stroke: "#0000ff" },
          });
        }
      } else if (towers.length > 0) {
        if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(towers[0], {
            visualizePathStyle: { stroke: "#0000ff" },
          });
        }
      } else {
        if (creep.transfer(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storages[0], {
            visualizePathStyle: { stroke: "#0000ff" },
          });
        }
      }
    } else {
      var containers = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => {
          return (
            s.structureType == STRUCTURE_CONTAINER &&
            s.id == sourceContainerID &&
            s.store.getUsedCapacity(RESOURCE_ENERGY) > 100
          );
        },
      });
      if (containers.length > 0) {
        if (
          creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(containers[0], {
            visualizePathStyle: { stroke: "#0000aa" },
          });
        }
      } else {
        if (creep.withdraw(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storages[0], {
            visualizePathStyle: { stroke: "#0000aa" },
          });
        }
      }
    }
  },
};

module.exports = roleHauler;
