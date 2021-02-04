var roleDefender = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // run code
  },
  melee: function (creep) {
    //Melee code
    var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      if (creep.attack(closestHostile) == ERR_NOT_IN_RANGE) {
        creep.moveTo(closestHostile, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    }
  },
  ranged: function (creep) {
    //Ranged code
  },
  healer: function (creep) {
    //healer code
  },
  spawn: function (room) {
    //do we need to spawn a defender?
  },
  spawnData: function (room, type) {
    let name = type + " -Defender(" + Game.time + ")[" + room.name + "]";
    let basicBody;
    let basicBodyCost;
    switch (type) {
      case "melee":
        basicBody = [ATTACK, TOUGH, MOVE];
        basicBodyCost = 130;
        break;
      case "ranged":
        basicBody = [RANGED_ATTACK, TOUGH, MOVE];
        basicBodyCost = 210;
        break;
      case "healer":
        basicBody = [HEAL, TOUGH, MOVE];
        basicBodyCost = 310;
        break;
    }
    let body = [];
    let memory = { role: "repairer", type: repairtype };

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

module.exports = roleDefender;
