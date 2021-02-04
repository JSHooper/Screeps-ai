const roleRepairer = require("./role.repairer");

var roomLogic = {
  spawnCreeps: function (room) {
    let spawn = room.find(FIND_MY_SPAWNS)[0];

    if (!spawn.spawning) {
      if (roleRepairer.spawn()) {
        let creepData = roleRepairer.spawnData();
        let result = spawn.spawnCreep(creepData);
        console.log("Tried spawning: " + result);
      }
    }
  },
};
