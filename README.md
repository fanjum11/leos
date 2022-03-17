# Learn to earn on Stacks - LEOS
Learn to earn leveraging Stacks 

Web3 based on blockchain technology is going to revolutionize the world. However we need to educate people about the new way of doing things. These people can be future customers who will use the web3 platform or they can be future participants who help advance the concepts. Learn to earn is an approach that we believe will help in the rapid spread of education.

There have been some efforts towards this. For example, Coinbase app has the feature whereby you can learn about a token or a web3 company. After that you are asked some questions related to what you learnt and if you provide the right answers you are rewarded some tokens.

However, this approach is a centralized approach. Coinbase controls all aspects of this learn to earn journey.  In this project we consider a decentralized approach to learn to earn based on the Stacks platform - a platform that provides for smart contracts on Bitcoin.


## WHAT IS LEOS

The plan here is to build a decentralized learning platform leveraging Stacks - the LEOS platform. The platform will enable companies to create learning material and to provide tokens as rewards for those who provide proof of learning. In addition, we expect this platform to be used by various teams structured as DAOs as they seek to reward the creators and curators of knowledge while the learners will pay for the learnings.

In this version, LEOs is build on Stacks directly using a LEO-token. In the future I expect LEOS to have it's own Appchain and its own token that settles on the Stacks chain. 

## WHY BLOCKCHAIN FOR LEOS

Learn and Earn systems in the web2 world require trust in the central entity that controls the platform. But such central entities can misuse the power that they have.  We need to build learn and earn systems where the system can function without requiring any dependency on a trusted third party. 

## HOW TO USE LEOS

There are three actors in the LEOS ecosystem 

1. Contract creator. We expect this to be a DAO in the long run - A DAO to enable efficient propagation of knowledge where everyone contributing to the knowledge propagation (creators, curators) is rewarded.  And the learners and product owners pay for the services of this DAO.
2. Company or Product owners - these are other web2 and web3 companies (DAOs maybe) that would like to spread knowledge about their product to the people and reward people who show proof of knowledge.
3. Individuals - These are people who are curious to learn more about web3 and activities in this space. They are rewarded with tokens on providing proof of knowledge. 

In the current version proof of knowledge is simple - a webpage with explanations and multiple choice questions related to a topic. 
Companies set up the web page with description and answers (THIS IS NOT COVERED IN THE CODE HERE). Individuals can log in, provide answers and then be rewarded if they satisfy the winning criteria. 

We next provide details about how each of these actors can leverage the LEOS platform. 

** We do not focus on the contract creator (to be a DAO in the future here). **

** We also do not focus on the front end. The focus is just on the smart contracts needed for a simple LEOS platform **



### AS A COMPANY THAT WANTS TO REWARD PEOPLE FOR LEARNING

The company is expected to create learning materials as well as tests based on the learning materials. These will be available on a web page for now and on IPFS in the future. 

There are three intervals related to a test namely
- test open interval : this is the number of stacks blocks during which anyone can answer the test questions. Individuals provide a hash of (their answers + secret) during this phase in order to prevent others from seeing their answers on the blockchain.
- test winner decision interval : this is the number of stacks blocks during which first the creator exposes their answers and then each individual provides their answers.  Answers from individuals are matched to answer key provided by the creator and winners decided. The prize money will be shared amongst the winners. 
- test reward claim interval: this is the interval during which the winners can claim their prizes by invoking the right functions on the smart contract. 

Finally the contract creator can get the tokens that are left over after the prize money is paid out. The left over could be because some winners did not claim the rewards or because the prize money had a remainder after being distributed to all the winners.

We next explain the steps that a company has to follow briefly.  Detailed explanations follow this brief description. 

1. Use stacks to purchase the LEOS tokens.
2. Use the LEOS tokens and provide test details that go the blockchain.
3. Provide the test answers (only multiple choice answers in this version) once the test is locked. The test answers are not accepted until the test is locked. 

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
The individual is presented a web page with details of the various tests, topics of the test and prize money etc. The individual can select the tests he/she is interested in.  We do not show this portion in this draft. 



#### DETAILS



## RECOMMENDED FLOW 


