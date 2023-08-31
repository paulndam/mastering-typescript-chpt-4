import * as fs from 'fs';
// Generics
// Generics in typescript allows us to write code in a way that it can work with a wide range of objects and primitive data types.
// Also implements our type guards in this process.

// syntax for . : <T>

function printGeneric<T>(value: T) {

    console.log(`Type of T is :---> ${typeof value}`)
    console.log(`Value is :---> ${value}`)

}

console.log(printGeneric(1))
console.log(printGeneric(true))
console.log(printGeneric("test"))
console.log(printGeneric(() => { }))

function multipleGeneric<A, B>(value1: A, value2: B) {

    console.log(`Type for value 1 is :---> ${typeof value1}. And value is ${value1}`)
    console.log(`Type for value 2 is :---> ${typeof value2}. And value is ${value2}`)



}

console.log(multipleGeneric(1, true))
console.log(multipleGeneric("string", 0))
console.log(multipleGeneric(1, () => { }))

// Limiting what type generic we want . example

class Concatenator<T extends Array<string> | Array<number>>{
    public concatArray(items: T): string {

        let returnString = ""

        for (let i = 0; i < items.length; i++){
            returnString += i > 0 ? "," : "";
            returnString += items[i].toString()
        }

        return returnString
    }

}

let concat = new Concatenator()
let result = concat.concatArray([
    "first", "second", "third", ""
])
console.log("result ------>",result)
let result2 = concat.concatArray([
    1,2,3
])
console.log("result ------>", result2)

// we can also limit type generic T. so that it only references the  properties of the object specified or the function

interface IPrintId {
    id: number,
    print(): void
}

interface IPrintName {
    name: string
    print(): void
}

function useT<T extends IPrintId | IPrintName>(item: T): void {

    item.print()
    // item.id // error : property id doesn't exist in type IPrintId or IPrintName
    // item.name // error : property name doesn't exist in type IPrintName or IPrintId'
}

// Generic Interfaces

interface IPrint {
    print():void

}

interface ILogInterface<T extends IPrint> {

    logToConsole(isPrint:T):void

}

class LogClass<T extends IPrint> implements ILogInterface<T> {

    logToConsole(isPrint: T): void {
        isPrint.print()
    }

}

let printObj: IPrint = {
    print() {
        console.log(`print obj is calling the print() method`)
    },
}
let t = new LogClass()
console.log(t.logToConsole(printObj))

// creating new objects with type generics.
function createClassInstance<T>(arg1: { new(): T }): T {
    return new arg1()
}


// Advanced Types in TypeScript

interface IAbRequired {
    a: number;
    b: string;
}

let ab: IAbRequired = { a: 1, b: "test" }

// Basically for each property in the weakInterface type,
// we make it optional
// otherwise use the given property.
type WeakInterface<T> = {
    [k in keyof T]?: T[k]
}

let allOptional: WeakInterface<IAbRequired> = {
    // we can define properties in this obj but the properties must match the type generic given
}
//  Readonly

type Readonlly<T> = {
    readonly[R in keyof T] : T[R]
}

let readOnlyVar: Readonlly<IAbRequired> = {
    a: 1, b: "test"

}
console.log("read only var ----->",readOnlyVar)

// Pick Mapped Type
// Allows us to construct a type based on the subset of properties of another type.

interface IAbc {
    a: number;
    b: string;
    c: boolean;
}

type PickAb = Pick<IAbc, "a" | "b">;

let pickObj: PickAb = {
    a: 1,
    b: "testy"
}

// Record Mapped Type.
//  Used for constructing types on the fly.

type RecordCd = Record<"c" | "d", number>;
let recordVal: RecordCd = {
    c: 1,
    d: 2
}

// CHAPTER 5.

// Asynchronous Language Features.

// To deal with asynchronous request, we use the callback mechanism.

// One of the techniques to write an asynchronous request is by using Promises.
// Promises allows us to chain multiple async request one after another
// Another technique is known as the async await.


// Callbacks.
// It executes after an async request has occurred.

function delayResponseWithCallBack(callback: () => void) {
    function executeAfterTimeOut() {
        console.log(`5. executeAfterTimeOut()`)
        callback()
    }
    console.log(`2. calling set time out`)
    setTimeout(executeAfterTimeOut, 1000)
    console.log(`3. after calling set time out`)

}

function callDelayAndWait() {
    function afterWait() {
        console.log(`6. After wait`)

    }
    console.log(`1. calling delayResponseWithCallBack `)
    delayResponseWithCallBack(afterWait)
    console.log(`4. after calling delayResponseWithCallBack`)
}

// console.log(callDelayAndWait())


// Promises.

// Help us get out the nature of callback hell.

// example of callback hell
fs.readFile("./test1.txt", (err, data) => {
    if (err) {
        console.log(`an error occurred : ${err}`);
    } else {
        console.log(`test1.txt contents : ${data}`);
        fs.readFile("./test2.txt", (err, data) => {
            if (err) {
                console.log(`an error occurred : ${err}`);
            } else {
                console.log(`test2.txt contents : ${data}`);
                fs.readFile("./test3.txt", (err, data) => {
                    if (err) {
                        console.log(`an error occurred : ${err}`);
                    } else {
                        console.log(`test3.txt contents
                            : ${data}`);
                    }
                })
            }
        })
    }
});

// example using promises to solve callback hell issue.

fs.promises.readFile("./test1.txt").then((values) => {
    console.log(`test1.tx contents : ${values}`)
    return fs.promises.readFile("./test2.txt")
}).then((values) => {
    console.log(`test2.txt contents : ${values}`)
    return fs.promises.readFile("./test3.txt")
}).then((values) => {
    console.log(`test3.txt contents : ${values}`)
}).catch((error) => {
    console.log(`Error occurred ${error}`)
})


// creating and writing our own promises.

function fnDelayedPromise(resolve: () => void, reject: () => void) {

    function afterTimeout() {
        resolve()
    }

    setTimeout(afterTimeout,5000)

}

// constructing a Promise object.

function delayResponsePromise(): Promise<void> {
    return new Promise<void>(fnDelayedPromise)

}

function delayPromise(): Promise<void>{

    return new Promise<void>(
        //constructor.
        (resolve: () => void, reject: () => void) => {
            // start of func definition.
            function afterTimeout() {
                resolve()
            }
            setTimeout(afterTimeout,5000)
        }
        // end of constructor
    )
}

delayPromise().then(() => {
    console.log(`Delayed promised returned`)
})

// Promise error
function errorPromise(): Promise<void> {
    return new Promise<void>(
        (   // constructor
            resolve: () => void,
            reject: () => void
        ) => {
            // function definition
            console.log(`2. calling reject()`);
            reject();
        }
    )
}
console.log(`1. calling errorPromise()`);
errorPromise().then(() => { })
    .catch(() => { console.log(`3. caught an error`) });




// Returning values from Promises.

function returnStringPromise(throwError:boolean): Promise<string>{

    return new Promise<string>(
        (resolve: (outputVal: string) => void, reject: (errorCode: number) => void) => {

            if (throwError) {
                 reject(101)
            }

            resolve("we have a string so we are good 😁")

    })
}

console.log("1.calling returnStringPromise")

returnStringPromise(false).then((val: string) => {
    console.log(`2. return value :---> ${val}`)
}).catch((err: number) => {
    console.log(`not called`)

})


// Decorators.
//  A decorator is a function, that is called with a specific set of parameters.
/*

- These params are populated automatically by the javascript run time.
- These params have data about the class, methods or properties to which the decorator is applied to.


*/

// syntax to write decorators.

function simpleDecorator(constructor: Function) {
    console.log(`simpleDecorator`)

}

function secondDecorator(constructor: Function) {
    console.log(`secondDecorator called`);
}



@simpleDecorator class ClassWithSimpleDecorator {

}

@simpleDecorator
@secondDecorator
class ClassWithMultipleDecorators {
}


let instance1 = new ClassWithSimpleDecorator()
let instance2 = new ClassWithSimpleDecorator()

console.log(`instance 1 ---> ${JSON.stringify(instance1)}`)
console.log(`instance 2 ---> ${JSON.stringify(instance2)}`)
