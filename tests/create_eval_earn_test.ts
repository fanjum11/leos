
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';

import { assert, assertEquals }
  from 'https://deno.land/std@0.90.0/testing/asserts.ts';


// ******************COMMENTS *********************
// I realize some statements such as following are redundant but did not remove the redundant statement in all places
//block.receipts[0].result.expectOk().expectBool(true);
//assertEquals("(ok true)", block.receipts[0].result);

// I also realize we can use variables to capture values of parameters used in contract calls
// this will make the contract calls easy to understand 
// did not do that since i had developed all tests without that 

// *************************************************
//import fc
//  from 'https://cdn.skypack.dev/fast-check';


// SOME PARAMETER VALUES USED IN THE TESTS BELOW RELATED TO SECRETS AND HASH
// We can assign these values to variables in future to improve readability 
// correct answers by creator
//(sha256 (answers + secret) 
//answers = 0x0a0b0c0d0a0b0c0d0a0b secret =1234567890)
//0xe34d0b1298ad1ed84f2b154b4b2d86495551ff02c11d82b9abf11aa9795a2c6d

// correct answers by test taker 
//(sha256 (answers + secret) 
//answers = 0x0a0b0c0d0a0b0c0d0a0b secret = 11223344556677889900)
//0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c

// 8 correct answers by test taker 
//answers = 0x0a0b0c0d0a0b0c0d0d0d secret = 11223344556677889900
// 0xe73787d5fd24b988a6b02c8c11fc1749e985fd30bf563983a4d5ead14642c928 

// 3 correct answers by test taker   
//answers = 0x0a0a0a0a0a0a0a0a0a0a secret = 11223344556677889900
//0xd27f4c573c5eb4007ef2a37f619af7d9d500013e8b2509ba5348a9f90e808788

// LOT MORE ANSWERS THAN QUESTIONS WITH SECRET AND PROOF
//answers = 0x0a0b0c0d0a0b0c0d0a0b0c0d0a0b secret = 11223344556677889900
// (sha256 0x0a0b0c0d0a0b0c0d0a0b0c0d0a0b11223344556677889900)
// 0x5f969d38215d08106f89df623c90026de4c99f3c9df9e76e1b073fb05bd13ff8

Clarinet.test({
    name: "Ensure that any creator can buy edu tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var tokenTrait = `${deployer.address}.edu-token`;
      var edu_token = 1000; 
  
      let block = chain.mineBlock([
        Tx.contractCall(
          "create_eval_earn",
          "purchase_edu_token",
          [types.principal(tokenTrait), types.uint(edu_token)],
          deployer.address
        ),
      ]);
      block.receipts[0].result.expectOk().expectBool(true);
      assertEquals("(ok true)", block.receipts[0].result);
    },
  });

Clarinet.test({
    name: "Ensure that the any creator can create multiple tests by paying edu tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        var deployer = accounts.get("deployer")!;
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
                    types.ascii('stacks is topic'),
                    types.ascii("www.stacks.co")
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
                    types.ascii('stacks is topic'),
                    types.ascii("www.stacks.co")
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
    name: "Ensure that a creator (deployer or not deployer) cannot create tests without tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        var deployer = accounts.get("deployer")!;
        var tokenTrait = `${deployer.address}.edu-token`;
        var wallet_1 = accounts.get("wallet_1")!;

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
                    types.ascii('stacks is topic'),
                    types.ascii("www.stacks.co")
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
                    types.ascii('stacks is topic'),
                    types.ascii("www.stacks.co")
                ],
                wallet_1.address
            ),
                ]);

        assertEquals(block.receipts.length, 2);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectErr().expectUint(1006);
        block.receipts[1].result.expectErr().expectUint(1006);;
    },
});

  Clarinet.test({
    name: "Ensure that the creator cannot answer the test when test is just created",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        var deployer = accounts.get("deployer")!;
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
                    types.ascii('stacks is topic'),
                    types.ascii("www.stacks.co")
                ],
                deployer.address
            ),
            Tx.contractCall(
                "create_eval_earn",
                "answers_by_creator",
                [types.uint(1), '0xabcd'],
                deployer.address
              ),
                ]);
        assertEquals(block.receipts.length, 3);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectUint(1);
        block.receipts[2].result.expectErr().expectUint(1003);
        assertEquals("(err u1003)", block.receipts[2].result);
    },
});


Clarinet.test({
    name: "Ensure that the creator CANNOT answer the test when test is still open",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        var deployer = accounts.get("deployer")!;
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
                    types.ascii('stacks is topic'),
                    types.ascii("www.stacks.co")
                ],
                deployer.address
            ),
        ]);

        chain.mineEmptyBlock(10);
        let nextBlock = chain.mineBlock([
            Tx.contractCall(
                "create_eval_earn",
                "answers_by_creator",
                [types.uint(1), '0xabcd'],
                deployer.address
              ),
        ]);

        assertEquals(nextBlock.receipts.length, 1);
        assertEquals(nextBlock.height, 13);
        nextBlock.receipts[0].result.expectErr().expectUint(1003);
        assertEquals("(err u1003)", nextBlock.receipts[0].result);
    },
});


Clarinet.test({
    name: "Ensure that the creator CAN answer the test when test is closed",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        var account1 = accounts.get("wallet_1")!;
        var deployer = accounts.get("deployer")!;
        var tokenTrait = `${deployer.address}.edu-token`;

        let block = chain.mineBlock([
            Tx.contractCall(
                "create_eval_earn",
                "purchase_edu_token",
                [types.principal(tokenTrait), types.uint(1000)],
                account1.address
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
                    types.ascii('stacks is topic'),
                    types.ascii("www.stacks.co")
                ],
                account1.address
            ),
        ]);

        chain.mineEmptyBlock(100);
        let nextBlock = chain.mineBlock([
            Tx.contractCall(
                "create_eval_earn",
                "answers_by_creator",
                [types.uint(1), '0xabcd'],
                account1.address
              ),
        ]);

        assertEquals(nextBlock.receipts.length, 1);
        assertEquals(nextBlock.height, 103);
        nextBlock.receipts[0].result.expectOk().expectBool(true);
        assertEquals("(ok true)", nextBlock.receipts[0].result);
    },
});


Clarinet.test({
    name: "Ensure that NO ONE OTHER THAN TEST CREATOR CAN answer the test when test is closed",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        var notContractOwner = accounts.get("wallet_1")!;
        var deployer = accounts.get("deployer")!;
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
                    types.ascii('stacks is topic'),
                    types.ascii("www.stacks.co")
                ],
                deployer.address
            ),
        ]);

        chain.mineEmptyBlock(100);
        let nextBlock = chain.mineBlock([
            Tx.contractCall(
                "create_eval_earn",
                "answers_by_creator",
                [types.uint(1), '0xabcd'],
                notContractOwner.address
              ),
        ]);

        assertEquals(nextBlock.receipts.length, 1);
        assertEquals(nextBlock.height, 103);
        nextBlock.receipts[0].result.expectErr().expectUint(1001);
        assertEquals("(err u1001)", nextBlock.receipts[0].result);
    },
});

Clarinet.test({
    name: 'get_max_test_id returns (ok,u0) every time',
    async fn(chain: Chain, accounts: Map<string, Account>) {

    let results = [...accounts.values()].map(account => {
        const who = types.principal(account.address);
        const msg = chain.callReadOnlyFn(
          'create_eval_earn', 'get_max_test_id', [], account.address);
        return msg.result;
    });
  
      // Assert
      assert(results.length > 0);
      results.forEach(msg => msg.expectOk())
    }
  });


//              TESTS FOR TEST TAKERS CODE 

Clarinet.test({
    name: "Ensure that a test cannot be answered before being created on the blockchain",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
  
      let block = chain.mineBlock([
        Tx.contractCall(
          "create_eval_earn",
          "answer_proof_by_test_taker",
          [types.uint(1), '0xabcd' ],
          deployer.address
        ),
      ]);
  
      block.receipts[0].result.expectErr().expectUint(1015);
      assertEquals("(err u1015)", block.receipts[0].result);
    },
  });

  Clarinet.test({
    name: "Ensure that a test CAN be answered anytime it is open",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            deployer.address
        ),
    ]);
        chain.mineEmptyBlock(90); 

        let block = chain.mineBlock([
        Tx.contractCall(
          "create_eval_earn",
          "answer_proof_by_test_taker",
          [types.uint(1), '0xabcd' ],
          wallet_2.address
        ),
      ]);

      block.receipts[0].result.expectOk().expectBool(true);
      assertEquals("(ok true)", block.receipts[0].result);
    },
  });

  Clarinet.test({
    name: "Ensure that a test CANNOT be answered once locked",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
    ]);
        chain.mineEmptyBlock(1190); 

        let block = chain.mineBlock([
        Tx.contractCall(
          "create_eval_earn",
          "answer_proof_by_test_taker",
          [types.uint(1), '0xabcd' ],
          wallet_2.address
        ),
      ]);

      block.receipts[0].result.expectErr().expectUint(1002);
      assertEquals("(err u1002)", block.receipts[0].result);
    },
  });

  Clarinet.test({
    name: "Ensure that a right answers plus secret puts you in the winner list",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),        

    ]);

      block.receipts[1].result.expectOk().expectBool(true);
      assertEquals("(ok true)", block.receipts[1].result);
      block.receipts[2].result.expectOk().expectBool(true);
      assertEquals("(ok true)", block.receipts[2].result);

    },
  });

  Clarinet.test({
    name: "Ensure that a providing many more answers plus secret DOES NOT GET you in the winner list",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0x5f969d38215d08106f89df623c90026de4c99f3c9df9e76e1b073fb05bd13ff8' ],
            wallet_2.address
          ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0x5f969d38215d08106f89df623c90026de4c99f3c9df9e76e1b073fb05bd13ff8' ],
            wallet_2.address
          ),        
    ]);

      block.receipts[1].result.expectErr().expectUint(1024);
      assertEquals("(err u1024)", block.receipts[1].result);
  
    },
  });

  Clarinet.test({
    name: "Ensure that not providing the hash in test answer phase WILL NOT make you a winner",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        

    ]);
    block.receipts[1].result.expectErr().expectUint(1019);
    assertEquals("(err u1019)", block.receipts[1].result);

    },
  });

  Clarinet.test({
    name: "Ensure that a right answers plus secret WILL NOT get you a winner if the creator has not submitted correct answers",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
   
    ]);

      block.receipts[0].result.expectErr().expectUint(1018);
      assertEquals("(err u1018)", block.receipts[0].result);

    },
  });


  Clarinet.test({
    name: "Ensure that HASH MISMATCH (hash before and after test locked) will not put you in the winner list",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var tokenTrait = `${deployer.address}.edu-token`;


      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0x007d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),        

    ]);

      block.receipts[1].result.expectErr().expectUint(1023);
      assertEquals("(err u1023)", block.receipts[1].result);

    },
  });

  Clarinet.test({
    name: "Ensure that PROOF MISMATCH (answers plus secret do not match hash) will not put you in the winner list",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0x007d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x112233445566778899','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),        

    ]);

      block.receipts[1].result.expectErr().expectUint(1013);
      assertEquals("(err u1013)", block.receipts[1].result);
    },
  });


  Clarinet.test({
    name: "Ensuring that not answering test during open interval DOES NOT get you into winner list even with right answers",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var wallet_3 = accounts.get("wallet_3")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_3.address
          ),        

    ]);

      block.receipts[1].result.expectOk().expectBool(true);
      assertEquals("(ok true)", block.receipts[1].result);
      block.receipts[2].result.expectOk().expectBool(true);
      assertEquals("(ok true)", block.receipts[2].result);
      block.receipts[3].result.expectErr().expectUint(1004);
      assertEquals("(err u1004)", block.receipts[3].result);

    },
  });


  Clarinet.test({
    name: "Ensure that a winner cannot claim the reward before reward interval starts",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(1), types.principal(tokenTrait) ],
            wallet_2.address
          ),
    ]);

      block.receipts[1].result.expectOk().expectBool(true);
      assertEquals("(ok true)", block.receipts[1].result);
      block.receipts[3].result.expectErr().expectUint(1008);
      assertEquals("(err u1008)", block.receipts[3].result);

    },
  });

  Clarinet.test({
    name: "Ensure that a winner CAN claim the reward in the reward phase",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var wallet_3 = accounts.get("wallet_3")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),  
          
    ]);


    chain.mineEmptyBlock(1110); 

    let newblock = chain.mineBlock([
          Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(15), types.principal(tokenTrait) ],
            wallet_2.address
          ),
    ]);

        newblock.receipts[0].result.expectOk().expectBool(true);
        assertEquals("(ok true)", newblock.receipts[0].result);
    },
  });

  Clarinet.test({
    name: "Ensure that NO ONE CAN CLAIM reward in the reward phase if no winners",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0a0a0a0a0a0a0a0a0a','0x11223344556677889900','0xd27f4c573c5eb4007ef2a37f619af7d9d500013e8b2509ba5348a9f90e808788' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),  
          
    ]);

    block.receipts[2].result.expectErr().expectUint(1016);
    assertEquals("(err u1016)", block.receipts[2].result);

    chain.mineEmptyBlock(1110); 

    let newblock = chain.mineBlock([
          Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(15), types.principal(tokenTrait) ],
            wallet_2.address
          ),
    ]);

        newblock.receipts[0].result.expectErr().expectUint(1016);
        assertEquals("(err u1016)", block.receipts[2].result);
    },
  });

  Clarinet.test({
    name: "Ensure that a winner CANNOT claim a wrong number of tokens in the reward phase",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var wallet_3 = accounts.get("wallet_3")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),  
          
    ]);


    chain.mineEmptyBlock(1110); 

    // correct number of tokens to claim is 15 since only one winner and prize is 15
    let newblock = chain.mineBlock([
          Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(10), types.principal(tokenTrait) ],
            wallet_2.address
          ),
    ]);

        newblock.receipts[0].result.expectErr().expectUint(1005);
        assertEquals("(err u1005)", newblock.receipts[0].result);
    },
  });


  Clarinet.test({
    name: "Ensure that a non-winner cannot claim the reward",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var wallet_3 = accounts.get("wallet_3")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),  
          
    ]);


    chain.mineEmptyBlock(1110); 

    let newblock = chain.mineBlock([
          Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(15), types.principal(tokenTrait) ],
            wallet_3.address
          ),
    ]);

      newblock.receipts[0].result.expectErr().expectUint(1004);
      assertEquals("(err u1004)", newblock.receipts[0].result);

    },
  });

  Clarinet.test({
    name: "Ensure that more than one winner can exist",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var wallet_3 = accounts.get("wallet_3")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),
          Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_3.address
          ),

    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_3.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),  
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_3.address
          ),  
    ]);

        block.receipts[3].result.expectOk().expectBool(true);
        assertEquals("(ok true)", block.receipts[3].result);
        block.receipts[3].result.expectOk().expectBool(true);
        assertEquals("(ok true)", block.receipts[3].result);
    },
  });

  Clarinet.test({
    name: "Ensure that test cannot be graded and you cannot win after grade phase is closed ",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var wallet_3 = accounts.get("wallet_3")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
        ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
    ]);


    chain.mineEmptyBlock(1110); 

    let newblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),  
        Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(7), types.principal(tokenTrait) ],
            wallet_2.address
          ),
    ]);

        newblock.receipts[0].result.expectErr().expectUint(1022);
        assertEquals("(err u1022)", newblock.receipts[0].result);
        newblock.receipts[1].result.expectErr().expectUint(1016);
        assertEquals("(err u1016)", newblock.receipts[1].result);
        newblock.receipts[2].result.expectErr().expectUint(1016);
        assertEquals("(err u1016)", newblock.receipts[2].result);

    },
  });


//     CONTRACT CREATOR GETTING STX AND REMAINDER OF TOKENS

  Clarinet.test({
    name: "Ensure that contract creator can get the remaining STX and tokens ",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var wallet_3 = accounts.get("wallet_3")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
        ),
        Tx.contractCall(
        "create_eval_earn",
        "answer_proof_by_test_taker",
        [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
        wallet_3.address
        ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),  
          Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_3.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_3.address
          ),  
    ]);


    chain.mineEmptyBlock(1110); 

    let newblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(7), types.principal(tokenTrait) ],
            wallet_2.address
          ),
          Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(7), types.principal(tokenTrait) ],
            wallet_3.address
          ),
    ]);

    chain.mineEmptyBlock(10010); 

    let lastblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "pay_remainder_to_contract_owner",
           [types.uint(1), types.principal(tokenTrait) ],
           deployer.address
          ),
    ]);

        lastblock.receipts[0].result.expectOk().expectBool(true);
        assertEquals("(ok true)", lastblock.receipts[0].result);

    },
  });

  Clarinet.test({
    name: "Ensure that contract creator CANNOT get the remaining STX and tokens before reward phase ends ",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var wallet_3 = accounts.get("wallet_3")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
        ),
        Tx.contractCall(
        "create_eval_earn",
        "answer_proof_by_test_taker",
        [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
        wallet_3.address
        ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),  
          Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_3.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_3.address
          ),  
    ]);


    chain.mineEmptyBlock(1110); 

    let newblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(7), types.principal(tokenTrait) ],
            wallet_2.address
          ),
          Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(7), types.principal(tokenTrait) ],
            wallet_3.address
          ),
    ]);

    chain.mineEmptyBlock(1010); 

    let lastblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "pay_remainder_to_contract_owner",
           [types.uint(1), types.principal(tokenTrait) ],
           deployer.address
          ),
    ]);

        lastblock.receipts[0].result.expectErr().expectUint(1020);
        assertEquals("(err u1020)", lastblock.receipts[0].result);
    },
  });
  

  Clarinet.test({
    name: "Ensure that anyone other than contract creator CANNOT get the remaining STX and tokens ",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var wallet_3 = accounts.get("wallet_3")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
        ),
        Tx.contractCall(
        "create_eval_earn",
        "answer_proof_by_test_taker",
        [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
        wallet_3.address
        ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),  
          Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_3.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_3.address
          ),  
    ]);


    chain.mineEmptyBlock(1110); 

    let newblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(7), types.principal(tokenTrait) ],
            wallet_2.address
          ),
          Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(7), types.principal(tokenTrait) ],
            wallet_3.address
          ),
    ]);

    chain.mineEmptyBlock(10010); 

    let lastblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "pay_remainder_to_contract_owner",
           [types.uint(1), types.principal(tokenTrait) ],
            wallet_1.address
          ),
    ]);

        lastblock.receipts[0].result.expectErr().expectUint(1021);
        assertEquals("(err u1021)", lastblock.receipts[0].result);

    },
  });

  Clarinet.test({
    name: "Ensure that contract creator CANNOT get STX when 0 tokens remain from a test ",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var wallet_3 = accounts.get("wallet_3")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
          ),
        Tx.contractCall(
            "create_eval_earn",
            "test_init",
            [
                types.principal(tokenTrait),
                types.uint(10),
                types.uint(8),
                types.uint(20),
                types.uint(100),
                '0xabcd',
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
        ),
        Tx.contractCall(
        "create_eval_earn",
        "answer_proof_by_test_taker",
        [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
        wallet_3.address
        ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),  
          Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b','0x11223344556677889900','0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_3.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_3.address
          ),  
    ]);


    chain.mineEmptyBlock(1110); 

    let newblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(10), types.principal(tokenTrait) ],
            wallet_2.address
          ),
          Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(10), types.principal(tokenTrait) ],
            wallet_3.address
          ),
    ]);

    chain.mineEmptyBlock(10010); 

    let lastblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "pay_remainder_to_contract_owner",
           [types.uint(1), types.principal(tokenTrait) ],
            deployer.address
          ),
    ]);

        lastblock.receipts[0].result.expectErr().expectUint(1011);
        assertEquals("(err u1011)", lastblock.receipts[0].result);

    },
  });



  Clarinet.test({
    name: "Ensure that contract owner can claim all token rewards even when no winner",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      var deployer = accounts.get("deployer")!;
      var wallet_1 = accounts.get("wallet_1")!;
      var wallet_2 = accounts.get("wallet_2")!;
      var wallet_3 = accounts.get("wallet_3")!;
      var tokenTrait = `${deployer.address}.edu-token`;

      let oldblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "purchase_edu_token",
            [types.principal(tokenTrait), types.uint(1000)],
            wallet_1.address
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
                types.ascii('stacks is topic'),
                types.ascii("www.stacks.co")
        ],
            wallet_1.address
        ),
        Tx.contractCall(
            "create_eval_earn",
            "answer_proof_by_test_taker",
            [types.uint(1), '0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c' ],
            wallet_2.address
          ),
    ]);
        chain.mineEmptyBlock(110); 

        let block = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "answers_by_creator",
            [types.uint(1), '0x0a0b0c0d0a0b0c0d0a0b'],
            wallet_1.address
          ),        
        Tx.contractCall(
            "create_eval_earn",
            "detailed_answers_by_test_takers",
           [types.uint(1), '0x0a0a0a0a0a0a0a0a0a0a','0x11223344556677889900','0xd27f4c573c5eb4007ef2a37f619af7d9d500013e8b2509ba5348a9f90e808788' ],
            wallet_2.address
          ),        
          Tx.contractCall(
            "create_eval_earn",
            "did_I_win",
           [types.uint(1) ],
            wallet_2.address
          ),  
          
    ]);

    block.receipts[2].result.expectErr().expectUint(1016);
    assertEquals("(err u1016)", block.receipts[2].result);

    chain.mineEmptyBlock(1110); 

    let newblock = chain.mineBlock([
          Tx.contractCall(
            "create_eval_earn",
            "get_my_award",
           [types.uint(1), types.uint(15), types.principal(tokenTrait) ],
            wallet_2.address
          ),
    ]);

        newblock.receipts[0].result.expectErr().expectUint(1016);
        assertEquals("(err u1016)", block.receipts[2].result);

    chain.mineEmptyBlock(10010); 

    let lastblock = chain.mineBlock([
        Tx.contractCall(
            "create_eval_earn",
            "pay_remainder_to_contract_owner",
            [types.uint(1), types.principal(tokenTrait) ],
            deployer.address
            ),
    ]);

        lastblock.receipts[0].result.expectOk().expectBool(true);
        assertEquals("(ok true)", lastblock.receipts[0].result);

    },
  });
// not testing for errors u1007, u1009, u1010, 1014,1017 
