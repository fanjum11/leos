
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure that any creator can buy edu tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var member = accounts.get("deployer")!;
      var organisation = accounts.get("wallet_2")!;
      var tokenTrait = `${deployer.address}.edu-token`;
  
      let block = chain.mineBlock([
        Tx.contractCall(
          "create_eval_earn",
          "purchase_edu_token",
          [types.principal(tokenTrait), types.uint(1000)],
          deployer.address
        ),
      ]);
  
      //chain.mineEmptyBlock(10);
    
      //block.receipts[0].result.expectOk().expectUint(1);
      block.receipts[0].result.expectOk().expectBool(true);
      assertEquals("(ok true)", block.receipts[0].result);
    },
  });

Clarinet.test({
    name: "Ensure that the any creator can create multiple tests by paying edu tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        var notContractOwner = accounts.get("wallet_1")!;
        var deployer = accounts.get("deployer")!;
        var member = accounts.get("deployer")!;
        var tokenTrait = `${deployer.address}.edu-token`;

        let block = chain.mineBlock([
            Tx.contractCall(
                "create_eval_earn",
                "purchase_edu_token",
                [types.principal(tokenTrait), types.uint(1000)],
                deployer.address
              ),
            Tx.contractCall(
                "create_eval_earn",
                "test_init",
                [
                    types.principal(tokenTrait),
                    types.uint(10),
                    types.uint(8),
                    types.uint(15),
                    types.uint(100),
                    '0xabcd',
                    types.ascii('abcdefgh'),
                    types.ascii("acbdacbd")
                ],
                deployer.address
            ),
            Tx.contractCall(
                "create_eval_earn",
                "test_init",
                [
                    types.principal(tokenTrait),
                    types.uint(10),
                    types.uint(8),
                    types.uint(15),
                    types.uint(100),
                    '0xabcd',
                    types.ascii('abcdefgh'),
                    types.ascii("acbdacbd")
                ],
                deployer.address
            ),
                ]);
        assertEquals(block.receipts.length, 3);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectUint(1);
        block.receipts[2].result.expectOk().expectUint(2);
    },
});

Clarinet.test({
    name: "Ensure that the number of tokens that can be purchased is limited by num of STX",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var member = accounts.get("deployer")!;
      var organisation = accounts.get("wallet_2")!;
      var tokenTrait = `${deployer.address}.edu-token`;
  
      let block = chain.mineBlock([
        Tx.contractCall(
          "create_eval_earn",
          "purchase_edu_token",
          [types.principal(tokenTrait), types.uint(100000000000000)],
          deployer.address
        ),
      ]);
  
      block.receipts[0].result.expectErr().expectUint(1012);
      assertEquals("(err u1012)", block.receipts[0].result);
    },
  });


  Clarinet.test({
    name: "Ensure that the any creator can create multiple tests by paying edu tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        var notContractOwner = accounts.get("wallet_1")!;
        var deployer = accounts.get("deployer")!;
        var member = accounts.get("deployer")!;
        var tokenTrait = `${deployer.address}.edu-token`;

        let block = chain.mineBlock([
            Tx.contractCall(
                "create_eval_earn",
                "test_init",
                [
                    types.principal(tokenTrait),
                    types.uint(10),
                    types.uint(8),
                    types.uint(15),
                    types.uint(100),
                    '0xabcd',
                    types.ascii('abcdefgh'),
                    types.ascii("acbdacbd")
                ],
                deployer.address
            ),
            Tx.contractCall(
                "create_eval_earn",
                "test_init",
                [
                    types.principal(tokenTrait),
                    types.uint(10),
                    types.uint(8),
                    types.uint(15),
                    types.uint(100),
                    '0xabcd',
                    types.ascii('abcdefgh'),
                    types.ascii("acbdacbd")
                ],
                deployer.address
            ),
                ]);

        assertEquals(block.receipts.length, 3);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectUint(1);
        block.receipts[2].result.expectOk().expectUint(2);
    },
});




//       var owner = accounts.get("wallet_1")!;