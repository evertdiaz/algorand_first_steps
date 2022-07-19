#samplecontract.py
from pyteal import *

def approval_program():

    global_count = Bytes("Count")

    handle_creation = Seq([
        App.globalPut(global_count, Int(0)),
        Return(Int(1))
    ])

    scratchCount = ScratchVar(TealType.uint64)

    add = Seq([
        scratchCount.store(App.globalGet(global_count)),
        App.globalPut(global_count, scratchCount.load() + Int(1)),
        Return(Int(1))
    ])

    deduct = Seq([
        scratchCount.store(App.globalGet(global_count)),
         If(scratchCount.load() > Int(0),
             App.globalPut(global_count, scratchCount.load() - Int(1)),
         ),
         Return(Int(1))
    ])

    handle_noop = Seq(
        # Assert(Global.group_size() == Int(1)), 
        Cond(
            [Txn.application_args[0] == Bytes("Add"), add], 
            [Txn.application_args[0] == Bytes("Deduct"), deduct]
        )
    )

    program = Cond(
        [Txn.application_id() == Int(0), handle_creation],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop]
    )

    return compileTeal(program, Mode.Application, version=6)


def clear_state_program():
    program = Return(Int(1))
    return compileTeal(program, Mode.Application, version=6)

# print out the approval program
print(approval_program())