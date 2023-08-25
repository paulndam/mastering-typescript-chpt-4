console.log("hello ")

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