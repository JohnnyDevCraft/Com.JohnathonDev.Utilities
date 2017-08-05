namespace Com.JohnathonDev.Utilities.Prover {
    export class Prover<T> {
        Target: T;
        protected _stack: string;
        protected _currentDate: Date;
        static OnError: (message: string, stack: string, time: Date) => void;


        constructor(target: T){
            this.Target = target;
            this._stack = this.getStack()
            this._currentDate = new Date();
        }

        private getStack(): string{
            let fnRE  = /function\s*([\w\-$]+)?\s*\(/i;
            var caller = arguments.callee.caller;
            var stack = "Stack = ";
            var fn;
            while (caller){
                fn = fnRE.test(caller.toString()) ? RegExp.$1 || "{?}" : "{?}";
                stack += "-->"+fn;
                caller = caller.arguments.callee.caller;
            };
            return stack;
        }

        //Basic Provers
        IsNotNull(){
            if(this.Target == null){
                Prover.OnError('Null value not allowed.', this._stack, this._currentDate);
            }
            return;
        }


        //String Provers
        protected ValidateIsType(check: string, expected: string){
            if((typeof this.Target) != expected){
                Prover.OnError(`Cannot run check on non ${expected} type: ${check}`, this._stack, this._currentDate);
                return false;
            }
        }


    }

    export class StringProver extends Prover<string>{
        constructor(target: string){
            super(target);
        }

        IsNotNullOrEmplty(){
            super.ValidateIsType("IsNotNullOrEmpty", "string");

            var test = <string><any>this.Target;

            if(test == null || test.trim().length == 0){
                Prover.OnError('Null or Empty values are not permitted for this property.', this._stack, this._currentDate);
            }
        }
        MaxLength(max: number){
            super.ValidateIsType("MaxLength", "string");
            let test = <string><any>this.Target;
            if(test.length > max){StringProver.OnError(`Exceeded max allowed characters of ${max}.`, this._stack, this._currentDate);}
        }
        MinLength(min: number){
            super.ValidateIsType("MaxLength", "string");
            let test = <string><any>this.Target;
            if(test.length < min){StringProver.OnError(`Did not exceed minimum allowed characters of ${min}.`, this._stack, this._currentDate);}
        }
    }
}