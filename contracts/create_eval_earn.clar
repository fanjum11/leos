
;;
(use-trait dao-token-trait .edu-token-trait.edu-token-trait)

(define-constant ERR_NOT_TEST_CREATOR (err u1001))
(define-constant ERR_TEST_LOCKED (err u1002))
(define-constant ERR_OPEN (err u1003))
(define-constant ERR_NOT_WINNER (err u1004))
(define-constant ERR_NOT_REWARD_AMOUNT (err u1005))
(define-constant ERR_NOT_ENOUGH_DAO (err u1006))
(define-constant ERR_UNRECOGNIZED_CALL (err u1007))
(define-constant ERR_TEST_OPEN (err u1010))
(define-constant ERR_TEST_REWARDS_STILL_OPEN (err u1011))
(define-constant ERR_NO_REMAINDER_TOKENS (err u1012))
(define-constant stx-per-dao-token u1000000) ;; mints 1 dao token
(define-constant ERR_NOT_ENOUGH_STX_TO_MINT_DAO (err u1014))
(define-constant ERR_PROOF_INCORRECT (err u1015))
(define-constant ERR_PROOF_MISMATCH (err u1016))
(define-constant ERR_REWARD_CLAIM_OPEN (err u1017))
(define-constant ERR_NOT_ENOUGH_STX_TO_TRANSFER (err u1018))


;; Owner
(define-constant contract-owner tx-sender)
(define-constant contract-owner-token-claim-interval u1000)
(define-constant test-reward-claim-duration u1000)


(define-data-var test-id-count uint u0)
(define-data-var active_tests (list 100 uint) (list))

