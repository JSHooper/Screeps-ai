var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    var sourceContainerID = "7cb954f339252e6";
    if (creep.memory.assignedsource == "source1") {
      if (creep.store.getFreeCapacity() > 0) {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0], {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
        }
      } else {
        var containers = creep.room.find(FIND_STRUCTURES, {
          filter: (s) => {
            return (
              s.structureType == STRUCTURE_CONTAINER &&
              s.id == sourceContainerID
            );
          },
        });
        if (
          creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(containers[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      }
    } else if (creep.memory.assignedsource == "source2") {
      if (creep.store.getFreeCapacity() > 0) {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[1], {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
        }
      } else {
        var storage = creep.room.find(FIND_STRUCTURES, {
          filter: (s) => {
            return s.structureType == STRUCTURE_STORAGE;
          },
        });
        if (creep.transfer(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storage[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      }
    }
  },
};

module.exports = roleHarvester;
