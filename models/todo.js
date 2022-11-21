"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");
      console.log("Overdue");
      const overduetasks = await Todo.overdue();
      console.log(
        overduetasks.map((item) => item.displayableString()).join("\n")
      );
      console.log("\n");
      console.log("Due Today");
      const duetasks = await Todo.dueToday();
      console.log(duetasks.map((item) => item.displayableString()).join("\n"));
      console.log("\n");
      console.log("Due Later");
      const duelatertasks = await Todo.dueLater();
      console.log(
        duelatertasks.map((item) => item.displayableString()).join("\n")
      );
    }
    static async overdue() {
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
            completed: false
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueToday() {
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueLater() {
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async markAsComplete(id) {
      return Todo.update(
        { completed: true },
        {
          where: {
            id,
          },
        }
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let date =
        this.dueDate === new Date().toLocaleDateString("en-CA")
          ? ""
          : this.dueDate;
      return `${this.id}. ${checkbox} ${this.title} ${date}`.trim();
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};