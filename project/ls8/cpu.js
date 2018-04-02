/**
 * LS-8 v2.0 emulator skeleton code
 */

const ADD  = 0b00001100; 
const CALL = 0b00001111; 
const CMP  = 0b00010110; 
const DEC  = 0b00011000; 
const DIV  = 0b00001110;
const HLT  = 0b00011011; 
const INC  = 0b00010111;
const INT  = 0b00011001; 
const IRET = 0b00011010; 
const JEQ  = 0b00010011; 
const JMP  = 0b00010001; 
const JNE  = 0b00010100; 
const LD   = 0b00010010; 
const LDI  = 0b00000100; 
const MUL  = 0b00000101; 
const NOP  = 0b00000000; 
const POP  = 0b00001011; 
const PRA  = 0b00000111; 
const PRN  = 0b00000110; 
const PUSH = 0b00001010;
const RET  = 0b00010000;
const ST   = 0b00001001; 
const SUB  = 0b00001101; 

const IM = 0x05; 
const IS = 0x06; 
const SP = 0x07; 

const E_FLAG = 0;
const G_FLAG = 1;
const L_FLAG = 2;

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        
        // Special-purpose registers
        this.reg.PC = 0; // Program Counter
        this.reg.FL = 0; // Flags

        this.reg[SP] = 0xF4; // empty stack
    }
	
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        const _this = this;

        this.clock = setInterval(() => {
            _this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    setFlag(flag, val) {
        if (val) {
            this.reg.FL |= 1 << flag;
        } else {
            this.reg.FL &= ~(1 << flag);
        }
    }

    getFlag(flag) {
        return (this.reg.FL & (1 << flag)) >> flag;
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'MUL':
                this.reg[regA] = this.reg[regA] * this.reg[regB];
                break;
            case 'ADD':
                this.reg[regA] = this.reg[regA] + this.reg[regB];
                break;
            case 'INC':
                this.reg[regA]++;
                break;
            case 'DEC':
                this.reg[regA]--;
                break;
            case 'CMP':
                this.setFlag(E_FLAG, this.reg[regA] === this.reg[regB]);
                this.setFlag(L_FLAG, this.reg[regA] < this.reg[regB]);
                this.setFlag(G_FLAG, this.reg[regA] > this.reg[regB]);
            break;
            default:
                console.log('default');
            }
    }
        
    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the next instruction.)
        let IR = this.ram.read(this.reg.PC);

        // Debugging output
        //console.log(`${this.reg.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        let operandA = this.ram.read(this.reg.PC + 1);
        let operandB = this.ram.read(this.reg.PC + 2);

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        /*
        switch (IR) {

            case HLT:
                this.stopClock();
                break;

            case LDI:
                this.reg[operandA] = operandB;
                break;

            case PRN:
                console.log(this.reg[operandA]);
                break;

            case MUL:
                this.alu('MUL', operandA, operandB);
                break;

            case PUSH:
                this.reg[SP]--;
                this.ram.write(this.reg[SP], this.reg[operandA]);
                break;

            case POP:
                this.reg[operandA] = this.ram.read(this.reg[SP]);
                this.reg[SP]++;
                break;

            case CALL:
                this.reg[SP]--;
                this.ram.write(this.reg[SP], this.reg.PC + 2);
                this.reg.PC = this.reg[operandA];
                break;

            default:
                console.log("Unknown instruction: " + IR.toString(2));
                this.stopClock();
                break;
        }
        */

        const ADD = (operandA, operandB) => {
            this.alu('ADD', oprandA, operandB);
        };
        const CALL = () => {
            this._push(operandB);
            this.reg.PC = this.reg[operandA]
        };
        const CMP = () => {
            this.alu('CMP', operandA, operandB);
        };
        const DEC = () => {
            this.alu('DEC', operandA);
        };
        const DIV = () => {
            this.alu('DIV', operandA, operandB);
        };
        const HLT = () => {
            this.stopClock();
        };
        const INC = () => {
            this.alu('INC', operandA);
        };
        const INT = () => {
            const intNum = this.reg[operandA];
            this.reg[IM] |= intNum;
        };
        const IRET = () => {
            for (let r=7; r >= 0; r--) {
                this.reg[r] = this._pop();
            }
            this.reg.PC = this._pop();
            this.flags.interruptsEnabled = true;
        };
        const JEQ = () => {
            if (this.getFlag(E_FLAG)) {
                this.reg.PC = this.reg[operandA];
                advancePC = false;
            } 
        };
    
        const JMP = () => {
            this.reg.PC = this.reg[operandA];
            advancePC = false;
        };
        const JNE = () => {
            if (!this.getFlag(E_FLAG)) {
                this.reg.PC = this.reg[operandA];
                advancePC = false;
            }
        };
        const LD = () => {
            this.reg[operandA] = this.ram.read(this.reg[operandB]);
        };
        const MUL = (operandA, operandB) => {
            this.alu('MUL', operandA, operandB);
        };
        const LDI = (operandA, operandB) => {
            this.reg[operandA] = operandB;
        };
        const NOP = () => {
            this.alu('INC', 'PC');
        };
        const POP = () => {
            this.reg[operandA] = this.ram.read(this.reg[SP]);
            this.reg[SP]++;
        };
        const _pop = () => {
            const val = this.ram.read(this.reg[SP]);
            this.alu('INC', SP);
            return val;
        };
        const PRA = () => {
            const reg = this.ram.read(this.reg.PC + 1);
            fs.writeSync(process.stdout.fd, String.fromCharCode(this.reg[reg]));
        };
        const PRN = (operandA) => {
            console.log(this.reg[operandA]);
        };
        const PUSH = () => {
            this.reg[SP]--;
            this.ram.write(this.reg[SP], this.reg[operandA]);
        };
        const _push = (val) => {
            this.alu('DEC', SP);
            this.ram.write(this.reg[SP], val);
        };
        const RET = () => {
            this.reg.PC = this._pop();
        };
        const STR = () => {
            this.ram.write(this.reg[operandA], this.reg[operandB]);
        };
        const SUB = () => {
            this.alu('SUB', operandA, operandB);
        };

        const ERROR = (IR) => {
            console.log('Unknown instruction: ' + IR.toString(2));
            this.stopClock();
        };

        const branchTable = {
            [ADD]  : ADD,
            [CALL] : CALL,
            [CMP]  : CMP, 
            [DEC]  : DEC, 
            [DIV]  : DIV, 
            [HLT]  : HLT, 
            [INC]  : INC, 
            [INT]  : INT, 
            [IRET] : IRET,  
            [JEQ]  : JEQ, 
            [JMP]  : JMP,
            [JNE]  : JNE,
            [LD]   : LD, 
            [LDI]  : LDI, 
            [MUL]  : MUL, 
            [NOP]  : NOP,  
            [POP]  : POP, 
            [PRA]  : PRA, 
            [PRN]  : PRN,
            [PUSH] : PUSH, 
            [RET]  : RET, 
            [ST]   : ST, 
            [SUB]  : SUB
        };

        if (Object.keys(branchTable).includes(IR.toString())) {
            branchTable[IR](operandA, operandB);
        } else {
            ERROR(IR);
        };

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        if (IR !== CALL && IR !== RET) {
            this.reg.PC += (IR >>> 6) + 1;
        };
    };
};

module.exports = CPU;
