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
      if (!this.build(creep)) {
        this.scavenger(creep);
      }
      //add scavenger code
    } else {
      this.withdrawEnergy(creep);
    }
  },
  withdrawEnergy: function (creep) {
    //Withdraw energy to build
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
  },
  build: function (creep) {
    // build code
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length > 0) {
      //console.log("Targets bigger than 0");
      if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        //console.log("Target not in range");
        creep.moveTo(targets[0], {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
      return true;
    } else {
      return false;
    }
  },
  scavenger: function (creep) {
    // when there is nothin to build
    const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
    if (target) {
      if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
  },
  spawn: function (room) {
    // check if we need builders
    var currentBuilders = _.filter(
      Game.creeps,
      (creep) => creep.memory.role == "builder"
    );

    if (currentBuilders.length < NUM_BUILDERS) {
      return true;
    }
  },
  spawnData: function (room) {
    // how to build a builder
    let name = repairtype + " -Builder(" + Game.time + ")[" + room.name + "]";
    let basicBody = [WORK, CARRY, MOVE];
    let basicBodyCost = 200;
    let body = [];
    let memory = { role: "builder" };

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

module.exports = roleBuilder;
