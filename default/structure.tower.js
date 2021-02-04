const towersHeal = false;

var structureTower = {
  /** @param {tower} tower **/

  run: function (tower) {
    if (towersHeal) {
      this.heal(tower);
    }

    this.attack(tower);
  },
  heal: function (tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) => structure.hits < structure.hitsMax,
      }
    );
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }
  },
  attack: function (tower) {
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  },
};

module.exports = structureTower;
