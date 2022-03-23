# Learn to earn on Stacks - LEOS

Humans have been teaching and learning since times immemorial. And there have been many different methods of teaching.

**Web3 based on blockchain technology provides a decentralized approach towards spreading knowledge.** This I believe will be another effective approach for spreading knowledge on any topic efficiently. 

An approach where everyone involved in spreading knowledge can be compensated without having to depend on trusted third parties. This approach towards teaching can be used to educate people about any topic - old traditional topics or new web3 related topics.  

**In order to bootstrap this new learning approach, we use the Learn to Earn technique.** In this case, the learners are provided rewards on demonstrating proof of learning. 

There have been some efforts towards creating Learn to Earn systems. For example, Coinbase app has the feature whereby you can learn about a token or a web3 company. After that you are asked some questions related to what you learnt and if you provide the right answers you are rewarded some tokens.However, this approach is a centralized approach. Coinbase controls all aspects of this learn to earn journey.  

In this project we consider a decentralized approach to learn to earn based on the Stacks platform - a platform that provides for smart contracts on Bitcoin. We use STX as well as a separate EDU token for this system. In the future, we expect this to migrate to a separate Appchain on the Stacks platform.


## WHAT IS LEOS

LEOS is a **decentralized learning platform leveraging Stacks**.  

The platform in the first version will be a learn to earn system and hence the name. This system will enable companies to create learning material and to provide EDU tokens as rewards for those who provide proof of learning. The learning material will involve tests.  Anyone can provide answers to the tests as proof of learning. Thus, the test creators create tests that the test takers provide answers for.  A test taker is declared to be a winner if the number of correct answers they provide is above a threshold.  The prize money of the test is then shared amongst all the winners. 

In this version, LEOs is built on Stacks directly using a EDU-token. In the future I expect LEOS to plug into a larger decentralized learning system with its own Appchain that settles on the Stacks chain.  We ignore this part of it in this repo for simplicity. 

In addition, in this version we have made an assumption that we can trust the test creators. We intend to relax this assumption in future versions of this project.

In future, we expect this platform to be used by various teams structured as DAOs as they seek to reward the creators and curators of knowledge while the learners will pay for the learnings.

## WHY BLOCKCHAIN FOR LEOS

The learning systems currently being used and specifically the Learn and Earn systems in the web2 world require trust in the central entity that controls the platform. But such central entities can misuse the power that they have.  We need to build learn and earn systems where the system can function without requiring any dependency on a trusted third party. 

And make it seamless to reward the entities that help in spreading knowledge efficiently without having to depend on trusted parties.  So we seek to reward the creators of knowledge, the curators of knowledged as well as the explainers who use their time to spread knowledge among their circle.

## HOW TO USE LEOS

There are three actors in the LEOS ecosystem 

1. Contract (Platform) creator. We expect this to be a DAO in the long run - A DAO to enable efficient propagation of knowledge where everyone contributing to the knowledge propagation (creators, curators, explainers) is rewarded.  And the learners and product owners pay for the services of this DAO in the future. In this version though the learners are rewarded for demonstrating proof of knowledge.
2. Company or Product owners - these are other web2 and web3 companies (DAOs maybe) that would like to spread knowledge about their product to the people and reward people who show proof of knowledge. We assume these are rational actors.
3. Individuals - These are people who are curious to learn more about any topic. They are rewarded with tokens on providing proof of knowledge. In this version, individuals are paid in tokens on providing proof of knowledge. In a future version we will have options for individuals to pay to obtain knowledge. 

In the current version proof of knowledge is simple - a webpage with explanations and multiple choice questions related to a topic.  Companies set up the web page with description and answers (THIS IS NOT COVERED IN THE CODE HERE). Individuals can log in, provide answers and then be rewarded if they satisfy the winning criteria. 

We next provide details about how each of these actors can leverage the LEOS platform. 

**We do not focus on the front end. The focus is just on the smart contracts needed for a simple LEOS platform**
**We also assume the test creators are trusted in this version and only consider multiple choice tests for now.**


### CONTRACT CREATOR
The contract creator (to be a DAO in the future) will deploy the smart contract. 

The contract creator will also transfer the unclaimed tokens of every test and the STX paid for the tokens to the contract creators wallet periodically.  The unclaimed tokens can be claimed long after all the test winners are allowed to claim their rewards.  Currently this is a predetermined interval of 10,000 blocks after any test rewards can be claimed by the test winners .

### AN ENTITY THAT WANTS TO REWARD PEOPLE FOR LEARNING

The entity (company, organization, DAO, individual etc) is expected to create learning materials as well as tests based on the learning materials. These will be available on a web page for now and on IPFS in the future. We call this entity as the test creator. 

The test creator creates the test by purchasing EDU tokens in lieu of STX. STX is paid to the contract. 

There are three intervals related to a test namely as shown in the lifecycle of the test below

![image](https://user-images.githubusercontent.com/4590487/159304400-6fd301e8-7759-4f00-907e-7615691c0b26.png)

- test open interval : this is the number of stacks blocks during which anyone can answer the test questions. Individuals provide a hash of (their answers + secret) during this phase in order to prevent others from seeing their answers on the blockchain. The length of this interval is decided by the creator of the test.
- test grading interval : this is the number of stacks blocks during which the creator provides their answers and then each individual verifies the answers.  Answers from individuals are matched to answer key provided by the creator and winners decided. The threshold to be declared a winner in a test is decided by the test creator.  The test creator also decides the prize money for the test. The prize money will be shared amongst the winners. 
- test reward claim interval: this is the interval during which the winners can claim their prizes by invoking the right functions on the smart contract. The winners cannot claim their reward once this interval ends. 

The contract creator can get the tokens that are left over after the token prize is paid out. The left over could be because some winners did not claim the rewards or because the prize money had a remainder after being distributed to all the winners.  

We next explain the steps that a test creator has to follow briefly.  Detailed explanations follow this brief description. To repeat what was stated earlier, the focus here is just on the smart contract and not on the front end. 

A test creator has to

1. Use stacks to purchase the EDU tokens.
2. Use the EDU tokens and provide test details that go the blockchain.
3. Provide the test answers (only multiple choice answers in this version) once the test is locked. The test answers by the test creator are not accepted until the test is locked. 

#### DETAILS

FIRST STEP

Purchase EDU tokens 

SECOND STEP 

The company will then provide details of the tests to be captured on the blockchain. The information to be provided is 

- Number of questions on the test
- How many answers have to be answered correctly to become a winner 
- Prize amount of EDU tokens for the test to be shared among the winners
- How long is the test open
- A hash of the test answers + secret 
- LINK to the learning materials and the test questions. 
- Topic area of the test 

Note that we only support multiple choice questions with four options a,b,c and d in this version. 

THIRD STEP

Once the test is closed, the test creator will have to provide the answer for every multiple choice question. These answers have to be sent in a particular format with choice a being coded as 0a. So in case of 4 questions with answers being options a, b, d and a, the message sent will be 0x0a0b0d0a. And the same when we have many more than 4 questions. 


### AS AN INDIVIDUAL THAT WANTS TO LEARN AND EARN 
The individual is presented a web page with details of the various tests, topics of the test and prize money etc. The individual can select the tests he/she is interested in.  

As mentioned earlier, we do not show the front end portion here. The focus is just on the smart contracts.  We expect this web page will interact with the smart contract according to the following steps.  

The steps to be followed by the web application (Webapp) used by the individual are as follows. 
1. Authorize the individual using the individual's wallet. 
2. Get a list of all the tests and determine which tests are open and their topics. Show this list to the individual. The individual will decide the topics to learn and tests to answer. 
3. The individual is then shown the learning material and the test questions. 
4. The individual answers the test questions; A hash of (test answers + individual's secret) is sent to the contract during the test open period. This hash is stored on the blockchain. The actual answers would ideally be stored in the individual's wallet although for now we assume the web app can be trusted to stored this securely and without sharing with others.  
5. The detailed answers to the test questions are transmitted by the web app to the smart contract once the test is locked during the test grading interval and before the test reward claim interval starts. These answers have to be sent in a particular format with choice a being coded as 0a. So in case of 4 questions with answers being options a, b, d and a, the message sent will be 0x0a0b0d0a. 
6. The web app determines if the individual is in the winner list after providing the answers. 
7. The individual via the webapp gets a list of winners on the test and the prize money on the test once the test grading interval ends. 
8. The individual then claims his/her reward if a winner with the right amount of prize money using his wallet via the webapp. 

In the future probably the wallet of the individual in combination with the web browser could get the test questions and learning material, display these to the user, get the user's answers, store the test answers in the wallet securely and transmit the answer hash when the test is open. Later the wallet can transmit the detailed answers to the LEOS smart contract once the test is locked. The wallet can then also claim the rewards.  In this manner the individual will not need to trust any third party deploying the web app.  

## HOW TO TEST THIS ON YOUR MACHINE ##

Get the code on your machine using git clone. We also assume that clarinet is installed on your machine. Given this follow the steps given below. 

1. *clarinet console*

##### Test Creator setting up the test #####

1. *(contract-call? .create_eval_earn purchase_edu_token .edu-token u100)* -- this purchases 100 edu tokens at the cost of 1000 stacks per token
2. *(contract-call? .create_eval_earn test_init .edu-token u10 u8 u15 u100 0xe34d0b1298ad1ed84f2b154b4b2d86495551ff02c11d82b9abf11aa9795a2c6d "Alex coin" "www.alexcoin.com/test1")* -- setting up a test with 10 questions, 8 questions to be answered correctly to be the winner, prize amount if 15 EDU tokens, test to be open for 100 blocks, answer hash key being (sha256 (answers + secret)  where answers for 10 multiple choice questions are 0x0a0b0c0d0a0b0c0d0a0b and secret is 1234567890). So (sha256 0x0a0b0c0d0a0b0c0d0a0b1234567890) being as shown. The test creator also has to specify the topic as a string ("Alex coin") and a link where the test and it's material is available as a string ("www.alexcoin.com/test1"). 

##### Test taker actions during the test open phase #####
 
The test taker gets the details of the test and decides which test to answer. 
1. *(contract-call? .create_eval_earn get_max_test_id)* - getting a list of all tests created so far. 
2. *(contract-call? .create_eval_earn get_test_details u1)* - Test taker getting details of test ID 1. this has to be done for all the tests for now. and only open tests in future. 

##### Test taker answering a test #####

1. *(contract-call? .create_eval_earn answer_proof_by_test_taker u1 0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c)* - the test taker provides an ID of the test being answered (TEST ID 1 here) and a hash of answers plus secret ; the secret will be different for each test taker. Here I assumed answers = 0x0a0b0c0d0a0b0c0d0a0b secret = 11223344556677889900). Therefore (sha256 0x0a0b0c0d0a0b0c0d0a0b11223344556677889900) is  0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c

##### Once test is closed #####
Advance the chain tip so that you are in the test grading phase
1. *::advance_chain_tip 100*

At this point the test creator can provide the detailed answers as
1. *(contract-call? .create_eval_earn answers_by_creator u1 0x0a0b0c0d0a0b0c0d0a0b )*

The test taker can then get a list of correct answers as follows: 
1. *(contract-call? .create_eval_earn get_correct_answers u1)*

and if the answers indicate that the test taker is going to be a winner, the test taker can provide detailed answers with proof of having answered the test during the test open interval. And ensure that the test creator is a winnner

1. *(contract-call? .create_eval_earn detailed_answers_by_test_takers u1 0x0a0b0c0d0a0b0c0d0a0b 0x11223344556677889900 0xb07d70393a602ce31691215a732f35aafd1d45b6cfb9a54769cda65c5f467f4c)*
2. *(contract-call? .create_eval_earn did_I_win u1)* 

##### Once grading interval is closed #####

1. *::advance_chain_tip 1000*

Test taker to determine the final list of winners: 
1. *(contract-call? .create_eval_earn get_final_list_of_winners u1)* - this will give a final list of winners for test ID 1 

From this the test taker should determine the EDU tokens that will be awarded to the test taker. If the test taker claims wrong number of EDU tokens as reward, his function call will be be successful. 
1. *(contract-call? .create_eval_earn get_my_award u1 u15 .edu-token)*  - so test taker is claiming the 15 EDU tokens as reward for being the winner of test ID 1. 


##### Once reward interval is closed #####

1. *::advance_chain_tip 10000*

The contract owner can claim any remainder EDU tokens from test ID 1 (since not all winners claimed the reward or since some EDU tokens are left over as they could not be evenly divided amongst the winners). In addition, all STX paid by the test creators will also be transferred to the contract owner if one or more EDU tokens are transferred. 

1. *(contract-call? .create_eval_earn pay_remainder_to_contract_owner u1 .edu-token)*


#### TEST-SUITE ####
A complete suite of tests to test the various functions under different conditions has also been developed. To execute this run the following command at the CLI 

1. *clarinet test*


