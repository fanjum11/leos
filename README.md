# Learn to earn on Stacks - LEOS

Web3 based on blockchain technology is going to revolutionize the world. However we need to educate people about the new way of doing things. These people can be future customers who will use the web3 platform or they can be future participants who help advance the concepts. Learn to earn is an approach that we believe will help in the rapid spread of education.

There have been some efforts towards this. For example, Coinbase app has the feature whereby you can learn about a token or a web3 company. After that you are asked some questions related to what you learnt and if you provide the right answers you are rewarded some tokens.

However, this approach is a centralized approach. Coinbase controls all aspects of this learn to earn journey.  In this project we consider a decentralized approach to learn to earn based on the Stacks platform - a platform that provides for smart contracts on Bitcoin.


## WHAT IS LEOS

LEOS is a decentralized learning platform leveraging Stacks - the LEOS platform. The platform will enable companies to create learning material and to provide tokens as rewards for those who provide proof of learning. In addition, we expect this platform to be used by various teams structured as DAOs as they seek to reward the creators and curators of knowledge while the learners will pay for the learnings.

In this version, LEOs is build on Stacks directly using a LEO-token. In the future I expect LEOS to have it's own Appchain and its own token that settles on the Stacks chain.

In addition, in this version we have made an assumption that we can trust the test creators. We intend to relax this assumption in future versions of this project.

## WHY BLOCKCHAIN FOR LEOS

Learn and Earn systems in the web2 world require trust in the central entity that controls the platform. But such central entities can misuse the power that they have.  We need to build learn and earn systems where the system can function without requiring any dependency on a trusted third party. 

## HOW TO USE LEOS

There are three actors in the LEOS ecosystem 

1. Contract (Platform) creator. We expect this to be a DAO in the long run - A DAO to enable efficient propagation of knowledge where everyone contributing to the knowledge propagation (creators, curators) is rewarded.  And the learners and product owners pay for the services of this DAO.
2. Company or Product owners - these are other web2 and web3 companies (DAOs maybe) that would like to spread knowledge about their product to the people and reward people who show proof of knowledge. We assume these are rational actors.
3. Individuals - These are people who are curious to learn more about web3 as well as services and products in this space. They are rewarded with tokens on providing proof of knowledge. In this version, individuals are paid im tokens on providing proof of knowledge. In a future version we will have options for individuals to pay to obtain knowledge. 

In the current version proof of knowledge is simple - a webpage with explanations and multiple choice questions related to a topic. 
Companies set up the web page with description and answers (THIS IS NOT COVERED IN THE CODE HERE). Individuals can log in, provide answers and then be rewarded if they satisfy the winning criteria. 

We next provide details about how each of these actors can leverage the LEOS platform. 

**We do not focus on the front end. The focus is just on the smart contracts needed for a simple LEOS platform**
**We also assume the test creators are trusted in this version and only consider multiple choice tests for now.**


### CONTRACT CREATOR
The contract creator (to be a DAO in the future) will deploy the smart contract. 

The contract creator will also transfer the unclaimed tokens of every test and the STX paid for the tokens to the contract creators wallet periodically.  The unclaimed tokens will be claimed after a predetermined interval of 10,000 blocks.

### AS A COMPANY THAT WANTS TO REWARD PEOPLE FOR LEARNING

The company is expected to create learning materials as well as tests based on the learning materials. These will be available on a web page for now and on IPFS in the future. We call this as the test creator. 

The test creator creates the test by purchasing EDU tokens in lieu of STX. STX is paid to the contract. 

There are three intervals related to a test namely as shown in the lifecycle of the test below

![image](https://user-images.githubusercontent.com/4590487/159304400-6fd301e8-7759-4f00-907e-7615691c0b26.png)

- test open interval : this is the number of stacks blocks during which anyone can answer the test questions. Individuals provide a hash of (their answers + secret) during this phase in order to prevent others from seeing their answers on the blockchain. The length of this interval is decided by the creator of the test.
- test grading interval : this is the number of stacks blocks during which the creator provides their answers and then each individual verifies the answers.  Answers from individuals are matched to answer key provided by the creator and winners decided. The threshold to be declared a winner in a test is decided by the test creator.  The test creator also decides the prize money for the test. The prize money will be shared amongst the winners. 
- test reward claim interval: this is the interval during which the winners can claim their prizes by invoking the right functions on the smart contract. The winners cannot claim their reward once this interval ends. 

The contract creator can get the tokens that are left over after the token prize is paid out. The left over could be because some winners did not claim the rewards or because the prize money had a remainder after being distributed to all the winners.  I

We next explain the steps that a test creator has to follow briefly.  Detailed explanations follow this brief description. The focus here is just on the smart contract and not on the front end. 

A test creator has to

1. Use stacks to purchase the LEOS tokens.
2. Use the LEOS tokens and provide test details that go the blockchain.
3. Provide the test answers (only multiple choice answers in this version) once the test is locked. The test answers by the test creator are not accepted until the test is locked. 

#### DETAILS

FIRST STEP

SECOND STEP 
The company will then provide details of the tests to be captured on the blockchain. The information to be provided is 
- Creator of the test
- Number of questions on the test
- Topic area of the test 
- LINK to the learning materials and the test questions. 
- Prize money to be shared among the winners 
- How long is the test open 
- And how long is the test prize window open 
- A hash of the test answers + secret 
- How many answers have to be answered correctly to become a winner aka winning percentage 
- 


### AS AN INDIVIDUAL THAT WANTS TO LEARN AND EARN 
The individual is presented a web page with details of the various tests, topics of the test and prize money etc. The individual can select the tests he/she is interested in.  We do not show the front end portion here. The focus is just on the smart contracts.  We expect this web page will interact with the smart contract according to the following steps.  

The steps to be followed by the web page used by the individual are as follows. 
1. get a list of all the tests and determine which tests are open and their topics. Show this list to the individual. The individual will decide the topics to learn and tests to answer. 
2. The individual provides a hash of (test answers + secret) to be stored on the blockchain when the test is open. 
3. The individual provides detailed answers to the test questions once the test is locked during the test winner decision interval and before the test reward claim interval starts. 
4. The individual determines if he/she is in the winner list after providing the answers. 
5. The individual gets a list of winners on the test and the prize money on the test once the winner decision interval ends. 
6. The individual then claims his/her reward if a winner with the right amount of prize money.

In the future probably the wallet of the individual could get the test questions, store the test answers and transmit the answer hash when the test is open and the detailed answers once the test is locked. the wallet can then also claim the rewards.  In this manner the individual will not need to trust any third party. 

#### DETAILS



## RECOMMENDED FLOW 

![image](https://user-images.githubusercontent.com/4590487/159304400-6fd301e8-7759-4f00-907e-7615691c0b26.png)

