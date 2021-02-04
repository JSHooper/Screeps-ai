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
  source0: function (creep) {
    // Source 0 Harvester
  },
  source1: function (creep) {
    // Source 1 Harvester
  },
  spawn: function (room) {
    // harvester spawn code
    var currentHarvesters = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "harvester"
    );
    var currentHarvestersSource0 = _.filter(
      Game.creeps,
      (creep) =>
        creep.memory.role == "harvester" && creep.memory.type == "source0"
    );
    var currentHarvestersSource1 = _.filter(
      Game.creeps,
      (creep) =>
        creep.memory.role == "harvester" && creep.memory.type == "source1"
    );
    let roomSources = room.find(FIND_SOURCES);
    if (currentHarvesters.length < NUM_HARVESTERS) {
      if (roomSources.length > 1) {
        //if there is more than 1 source in the room
        if (currentHarvestersSource0.length < NUM_HARVESTERS_SOURCE0) {
          return "source0";
        } else if (currentHarvestersSource1.length < NUM_HARVESTERS_SOURCE1) {
          return "source1";
        }
      } else {
        if (currentHarvestersSource0.length < NUM_HARVESTERS_SOURCE0) {
          return "source0";
        }
      }
    }
  },
  spawnData: function (room, type) {
    // harvester body
    let name = type + " -Harvester(" + Game.time + ")[" + room.name + "]";
    let basicBody = [WORK, WORK, CARRY, MOVE];
    let basicBodyCost = 300;
    let body = [];
    let memory = { role: "harvester", type: type };

    let maxEnergy = room.energyCapacityAvailable;

    // Get the bodyPartNumber that can be created with maxEnergy
    let bodyPartNumber = Math.floor(maxEnergy / basicBodyCost);

    // Create the body
    let i;
    for (i = 0; i < bodyPartNumber; i++) {
      body = body.concat(basicBody);
    }

    return { name, body, memory };
  },
};

module.exports = roleHarvester;
