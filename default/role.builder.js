var roleBuilder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }

    if (creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length > 0) {
        //console.log("Targets bigger than 0");
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          //console.log("Target not in range");
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      } else {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              (structure.structureType == STRUCTURE_STORAGE ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_EXTENSION) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
          },
        });

        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
            visualizePathStyle: { stroke: "#ffffff" },
          });
          creep.say("Transfer");
        }
      }
    } else {
      var energySource = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => {
          return (
            (s.structureType == STRUCTURE_STORAGE ||
              s.structureType == STRUCTURE_CONTAINER ||
              s.structureType == STRUCTURE_TOWER) &&
            s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });

      if (creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(energySource, {
          visualizePathStyle: { stroke: "#aa0000" },
        });
      }
    }
  },
};

module.exports = roleBuilder;
