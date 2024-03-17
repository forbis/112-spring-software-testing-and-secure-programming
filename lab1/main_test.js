const test = require('node:test');
const assert = require('assert');
const { MyClass, Student } = require('./main');

const myclass = new MyClass();
const alpha = new Student();
alpha.setName('alpha');

test("Test MyClass's addStudent", () => {
    // TODO
    // 1. no one in class.
    assert.strictEqual(myclass.students.length, 0);

    // 2. if add not from Student
    assert.strictEqual(myclass.addStudent("student"), -1);

    // 3. add student from Student
    myclass.addStudent(alpha);
    assert.strictEqual(myclass.students.length, 1);
    // throw new Error("Test not implemented");
});

test("Test MyClass's getStudentById", () => {
    // TODO
    // 1. student doesn't exist
    assert.strictEqual(myclass.getStudentById(10), null);
    // 2. student exist
    assert.strictEqual(myclass.getStudentById(0), alpha);
    // 3. Id isn't a number
    assert.strictEqual(myclass.getStudentById("alpha"), undefined);
    // 4. Id is negative number
    assert.strictEqual(myclass.getStudentById(-1), null);
    //throw new Error("Test not implemented");
});

test("Test Student's setName", () => {
    // TODO
    let beta = new Student();
    // 1. name isn't string
    beta.setName(123);
    assert.strictEqual(beta.name, undefined);
    // 2. name is string
    beta.setName("beta");
    assert.strictEqual(beta.name, "beta");
    //throw new Error("Test not implemented");
});

test("Test Student's getName", () => {
    // TODO
    let gama = new Student();
    // 1. name isn't set
    assert.strictEqual(gama.getName(), "");
    // 2. name is set
    gama.setName("gama");
    assert.strictEqual(gama.getName(), "gama");
    //throw new Error("Test not implemented");
});
