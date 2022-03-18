
;;
(use-trait edu-token-trait .edu-token-trait.edu-token-trait)

(define-constant ERR_NOT_TEST_CREATOR (err u1001))
(define-constant ERR_TEST_LOCKED (err u1002))
(define-constant ERR_OPEN (err u1003))
(define-constant ERR_NOT_WINNER (err u1004))
(define-constant ERR_NOT_REWARD_AMOUNT (err u1005))
(define-constant ERR_NOT_ENOUGH_TOKEN (err u1006))
(define-constant ERR_UNRECOGNIZED_CALL (err u1007))
(define-constant ERR_TEST_OPEN (err u1010))
(define-constant ERR_TEST_REWARDS_STILL_OPEN (err u1011))
(define-constant ERR_NO_REMAINDER_TOKENS (err u1012))
(define-constant ERR_NOT_ENOUGH_STX_TO_MINT_TOKEN (err u1014))
(define-constant ERR_PROOF_INCORRECT (err u1015))
(define-constant ERR_PROOF_MISMATCH (err u1016))
(define-constant ERR_REWARD_CLAIM_OPEN (err u1017))
(define-constant ERR_NOT_ENOUGH_STX_TO_TRANSFER (err u1018))


;; Owner
(define-constant contract-owner tx-sender)
(define-constant contract-owner-token-claim-interval u10000)
(define-constant test-reward-claim-duration u1000)
(define-constant stx-per-edu-token u1000) ;; mints 1 EDU token


(define-data-var test-id-count uint u0)

(define-map test_details {id: uint} 
        {
            creator: principal,
            number_ques: uint,
            total_prize_money: uint,
            test_locked_at_block: uint, 
            test_reward_closed_at_block: uint, ;; call add test_retired
            test_answers_hash: (buff 256),
            test_topic: (string-ascii 64),
            test_at_link: (string-ascii 128)
        }
)

(define-map test_payment_status {test_id: uint}
    {
        prize-amount-paid: uint
    }
)

;; was answer_detailed
(define-map answer_list_by_creator {test_id: uint}
  {
      test_creator_id: principal,
      answer_list: (buff 256)
  }
)

(define-map test_taker_ans_hash {test_id: uint, test_taker_id: principal}
{
    answer_hash: (buff 256)
}
)


(define-map test_award_winner_list {test_id: uint}
{
    test_winner_list: (list 100 principal)
}

)


(define-public (purchase-edu-token (token-trait <edu-token-trait>) (edu-token-amount uint))
    (let
        (
            (required-stx (* stx-per-edu-token edu-token-amount))
        )
        (asserts! (>= (stx-get-balance tx-sender) required-stx) ERR_NOT_ENOUGH_STX_TO_MINT_TOKEN)
        (try! (stx-transfer? required-stx tx-sender (as-contract tx-sender)))
        (try! (contract-call? token-trait mint edu-token-amount tx-sender))
        (ok true)
    )
)