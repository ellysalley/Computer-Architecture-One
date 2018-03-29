const readline = require('readline');
const fs = require('fs');
const RAM = require('./ram');
const CPU = require('./cpu');

const ram = new RAM(256);
const cpu = new CPU(ram);

/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory(cpu) {

    // Hardcoded program to print the number 8 on the console

    // const program = [ // print8.ls8
    //     "10011001", // LDI R0,8  Store 8 into R0
    //     "00000000",
    //     "00001000",
    //     "01000011", // PRN R0    Print the value in R0
    //     "00000000",
    //     "00000001"  // HLT       Halt and quit
    // ];

    // const program = [
    //     "10011001",
    //     "00000000",
    //     "00001000",
    //     "10011001",
    //     "00000001",
    //     "00001001",
    //     "10101010",
    //     "00000000",
    //     "00000001",
    //     "01000011",
    //     "00000000",
    //     "00000001"
    // ];


    // Load the program into the CPU's memory a byte at a time
    /*
    for (let i = 0; i < program.length; i++) {
        cpu.poke(i, parseInt(program[i], 2));
    }
    */

    let program = [];
    if (process.argv.length === 3) {
        var lineReader = readline.createInterface({
            input: fs.createReadStream(process.argv[2])
        });
        lineReader.on('line', function(line) {
            // console.log('Line from file:', line);
    
            // let str = line.split('#')[0].slice(0, 8);
            let byteAndComment = line.split('#');
            let byteStr = byteAndComment[0];
            // bytetr = byteStr.slice(0, 8);
            byteStr = byteStr.trim();
    
            // let byte = parseInt(byteStr, 2);
    
            // if (!isNaN(byte)) {
            //     cpu.poke(address++, byte);
            // }
            if (byteStr > 1) {
                program.push(byteStr);
            } else {
                return;
            }
        });
        lineReader.on('close', function() {
            processProgram(program, cpu);
        });
    } else {
        console.log('provide a .ls8 file');
    }
};

function processProgram(arr, cpu) {
    for (let i = 0; i < arr.length; i++) {
        cpu.poke(i, parseInt(arr[i], 2));
    }
    cpu.startClock();
}


loadMemory(cpu);