const roleHarvester = require("role.harvester");
const roleUpgrader = require("role.upgrader");
const roleBuilder = require("role.builder");
const roleRepairer = require("role.repairer");
const roleHauler = require("role.hauler");
const roleDefender = require("role.defender");
const structureTower = require("./structure.tower");

const NUM_HARVESTERS = 2; //Needs to be evenly split if more than one spawn
const NUM_HARVESTERSS1 = NUM_HARVESTERS / 2;
const NUM_HARVESTERSS2 = NUM_HARVESTERS / 2;
const NUM_UPGRADERS = 2;
const NUM_BUILDERS = 2;
const NUM_REPAIRERS = 7;
const NUM_REPAIRERS_WALL = 3;
const NUM_REPAIRERS_ROAD = 1;
const NUM_REPAIRERS_TOWER = 1;
const NUM_REPAIRERS_CONTAINER = 1;
const NUM_HAULERS = 5;
const NUM_DEFENDERS = 3;

var towers = ["006b7e85f19f6fe", "9b2fdfec9372363"];

module.exports.loop = function () {
  var currentHarvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester"
  );
  var currentHarvestersSource1 = _.filter(
    Game.creeps,
    (creep) =>
      creep.memory.role == "harvester" &&
      creep.memory.assignedsource == "source1"
  );
  var currentHarvestersSource2 = _.filter(
    Game.creeps,
    (creep) =>
      creep.memory.role == "harvester" &&
      creep.memory.assignedsource == "source2"
  );
  var currentUpgraders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "upgrader"
  );
  var currentBuilders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "builder"
  );
  var currentRepairers = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "repairer"
  );
  var currentRepairerswalls = _.filter(
    Game.creeps,
    (creep) =>
      creep.memory.role == "repairer" && creep.memory.priorityrepair == "wall"
  );
  var currentRepairersroads = _.filter(
    Game.creeps,
    (creep) =>
      creep.memory.role == "repairer" && creep.memory.priorityrepair == "road"
  );
  var currentRepairerscontainers = _.filter(
    Game.creeps,
    (creep) =>
      creep.memory.role == "repairer" &&
      creep.memory.priorityrepair == "container"
  );
  var currentRepairerstowers = _.filter(
    Game.creeps,
    (creep) =>
      creep.memory.role == "repairer" && creep.memory.priorityrepair == "tower"
  );
  var currentHaulers = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "hauler"
  );
  var currentDefenders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "defender"
  );

  // Tower code
  for (var i in towers) {
    var tower = Game.getObjectById(towers[i]);
    if (tower) {
      structureTower.run(tower);
    }
  }

  // Controlling the creeps in the game
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == "defender") {
      roleDefender.run(creep);
    }
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == "builder") {
      roleBuilder.run(creep);
    }
    if (creep.memory.role == "repairer") {
      roleRepairer.run(creep);
    }
    if (creep.memory.role == "hauler") {
      roleHauler.run(creep);
    }
  }

  //cleanup of dead creeps from memory
  for (var i in Memory.creeps) {
    if (!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }

  //Create new creeps if needed

  //Spawn Defenders if there are hostiles
  if (Game.spawns["Spawn1"].room.find(FIND_HOSTILE_CREEPS).length > 0) {
    if (currentDefenders.length < NUM_DEFENDERS) {
      var spawnResult = Game.spawns["Spawn1"].spawnCreep(
        [
          ATTACK,
          ATTACK,
          ATTACK,
          ATTACK,
          TOUGH,
          TOUGH,
          TOUGH,
          TOUGH,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
        ],
        "Defender" + Game.time,
        { memory: { role: "defender" } }
      );

      switch (spawnResult) {
        case 0:
          console.log("Spawning Defender");
          break;
        case -1:
          console.log("(Defender) - Not the Owner of the Spawn");
          break;
        case -3:
          console.log("(Defender) - Creep with same name");
          break;
        case -4:
          console.log("(Defender) - Spawn Busy");
          break;
        case -6:
          console.log("(Defender) - Not enough energy");
          break;
        default:
          console.log("(Defender) - Other error");
      }
    }
  }

  if (currentHarvesters.length < NUM_HARVESTERS) {
    if (currentHarvestersSource1.length < NUM_HARVESTERSS1) {
      var spawnResult = Game.spawns["Spawn1"].spawnCreep(
        [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE],
        "S1-Harvester" + Game.time,
        { memory: { role: "harvester", assignedsource: "source1" } }
      );
    } else if (currentHarvestersSource2.length < NUM_HARVESTERSS2) {
      var spawnResult = Game.spawns["Spawn1"].spawnCreep(
        [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE],
        "S2-Harvester" + Game.time,
        { memory: { role: "harvester", assignedsource: "source2" } }
      );
    }

    switch (spawnResult) {
      case 0:
        console.log("Spawning Harvester");
        break;
      case -1:
        console.log("(Harvester) - Not the Owner of the Spawn");
        break;
      case -3:
        console.log("(Harvester) - Creep with same name");
        break;
      case -4:
        console.log("(Harvester) - Spawn Busy");
        break;
      case -6:
        console.log("(Harvester) - Not enough energy");
        break;
      default:
        console.log("(Harvester) - Other error");
    }
  }

  //Upgraders
  if (currentUpgraders.length < NUM_UPGRADERS) {
    var spawnResult = Game.spawns["Spawn1"].spawnCreep(
      [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE],
      "Upgrader" + Game.time,
      { memory: { role: "upgrader" } }
    );

    switch (spawnResult) {
      case 0:
        console.log("Spawning Upgrader");
        break;
      case -1:
        console.log("(Upgrader) - Not the Owner of the Spawn");
        break;
      case -3:
        console.log("(Upgrader) - Creep with same name");
        break;
      case -4:
        console.log("(Upgrader) - Spawn Busy");
        break;
      case -6:
        console.log("(Upgrader) - Not enough energy");
        break;
      default:
        console.log("(Upgrader) - Other error");
    }
  }

  //Builders
  if (currentBuilders.length < NUM_BUILDERS) {
    var spawnResult = Game.spawns["Spawn1"].spawnCreep(
      [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
      "Builder" + Game.time,
      { memory: { role: "builder" } }
    );

    switch (spawnResult) {
      case 0:
        console.log("Spawning Builder");
        break;
      case -1:
        console.log("(Builder) - Not the Owner of the Spawn");
        break;
      case -3:
        console.log("(Builder) - Creep with same name");
        break;
      case -4:
        console.log("(Builder) - Spawn Busy");
        break;
      case -6:
        console.log("(Builder) - Not enough energy");
        break;
      default:
        console.log("(Builder) - Other error");
    }
  }

  //Repairers
  if (currentRepairers.length < NUM_REPAIRERS) {
    var repairertype;
    if (currentRepairerscontainers.length < NUM_REPAIRERS_CONTAINER) {
      repairertype = "container";
    } else if (currentRepairersroads.length < NUM_REPAIRERS_ROAD) {
      repairertype = "road";
    } else if (currentRepairerswalls.length < NUM_REPAIRERS_WALL) {
      repairertype = "wall";
    } else if (currentRepairerstowers.length < NUM_REPAIRERS_TOWER) {
      repairertype = "tower";
    } else {
      repairertype = "generic";
    }
    var spawnResult = Game.spawns["Spawn1"].spawnCreep(
      [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
      repairertype + "-Repairer(" + Game.time + ")",
      { memory: { role: "repairer", priorityrepair: repairertype } }
    );

    switch (spawnResult) {
      case 0:
        console.log("Spawning Repairer");
        break;
      case -1:
        console.log("(Repairer) - Not the Owner of the Spawn");
        break;
      case -3:
        console.log("(Repairer) - Creep with same name");
        break;
      case -4:
        console.log("(Repairer) - Spawn Busy");
        break;
      case -6:
        console.log("(Repairer) - Not enough energy");
        break;
      default:
        console.log("(Repairer) - Other error");
    }
  }

  if (currentHaulers.length < NUM_HAULERS) {
    var spawnResult = Game.spawns["Spawn1"].spawnCreep(
      [
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
      ],
      "Hauler" + Game.time,
      { memory: { role: "hauler" } }
    );

    switch (spawnResult) {
      case 0:
        console.log("Spawning Hauler");
        break;
      case -1:
        console.log("(Hauler) - Not the Owner of the Spawn");
        break;
      case -3:
        console.log("(Hauler) - Creep with same name");
        break;
      case -4:
        console.log("(Hauler) - Spawn Busy");
        break;
      case -6:
        console.log("(Hauler) - Not enough energy");
        break;
      default:
        console.log("(Hauler) - Other error");
    }
  }
};
