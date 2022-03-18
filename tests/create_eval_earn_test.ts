
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
    name: "Ensure that the any creator can create a test by paying edu tokens",
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
                    types.utf8("abcdefgh"),
                    types.utf8("acbdacbd")
                ],
                deployer.address
            ),
                ]);
        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectOk().expectBool(true);
        //block.receipts[1].result.expectOk().expectUint(1);
    },
});



