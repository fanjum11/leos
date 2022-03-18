
;;
(use-trait edu-token-trait .edu-token-trait.edu-token-trait)

(define-constant ERR_NOT_TEST_CREATOR (err u1001))
(define-constant ERR_TEST_LOCKED (err u1002))
(define-constant ERR_OPEN (err u1003))
(define-constant ERR_NOT_WINNER (err u1004))
(define-constant ERR_NOT_REWARD_AMOUNT (err u1005))
(define-constant ERR_NOT_ENOUGH_TOKEN (err u1006))
(define-constant ERR_TOKEN_CALL_FAIL (err u1007))
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
            test_grade_starting_at_block: uint, 
            test_grade_closed_at_block: uint, ;; rewards will be given for 10k blocks after this only
            test_answers_hash: (buff 256),
            test_topic: (string-ascii 64),
            test_at_link: (string-ascii 128),
            min_correct_answers_reqd: uint
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

(define-public (test_init
        (token-trait <edu-token-trait>)
        (num_ques uint)
        (prize_amount uint)
        (blocks_test_open_for uint)
        (answer_hash_key (buff 256)) ;; hash (answers + secret)
        (topic_of_test (string-ascii 64) )
        (test_available_at_link (string-ascii 128))
        (num_correct_answers uint)
        ) 
    (let
        (
            (test_id (+ (var-get test-id-count) u1))
            (test_end_block (+ block-height blocks_test_open_for))
            (reward_claim_after_block (+ test_end_block test-reward-claim-duration))

        )
        (try! (transfer-token-to-contract token-trait prize_amount))
        (var-set test-id-count test_id) ;; no test_id of zero
        (map-set test_details {id: test_id} 
                    {
                        creator: tx-sender, 
                        number_ques: num_ques,
                        total_prize_money: prize_amount, 
                        test_grade_starting_at_block: test_end_block,
                        test_grade_closed_at_block: reward_claim_after_block, 
                        test_answers_hash: answer_hash_key,
                        test_topic: topic_of_test,
                        test_at_link: test_available_at_link,
                        min_correct_answers_reqd: num_correct_answers
                    }
        )
        (ok test_id)
    )
)


(define-public (transfer-token-to-contract (token-trait <edu-token-trait>) (token-amount uint))
    (let
        (
            (user-token (unwrap! (contract-call? token-trait get-balance tx-sender) ERR_TOKEN_CALL_FAIL))
        )
        (asserts! (>= user-token token-amount) ERR_NOT_ENOUGH_TOKEN)
        (try! (contract-call? token-trait transfer? token-amount tx-sender (as-contract tx-sender)))
        (ok true)
    )
)

;; hash_of_answers is actually hash(answers + secret)
(define-public (answer_proof_by_test_taker (test_id uint) (hash_of_answers (buff 256)))
;; the test taker can change answers until the test is locked
;; last set of answers count   
  (begin
    (asserts! (< block-height (unwrap! (get test_grade_starting_at_block (map-get? test_details {id: test_id})) (err u101))  ) ERR_TEST_LOCKED)
    (map-set test_taker_ans_hash {test_id: test_id, test_taker_id: tx-sender} {answer_hash: hash_of_answers } )
    (ok true)
  )
)

;;a fun to allow the test creator to provide the answers and grade once test is locked
;; - answer to each question
;; have to check if test locked before answers entered 
(define-public (answers_by_creator (test_id uint) (all_answers (buff 256)) )
;;;HAVE TO GET THE SECRET AND HASH VALUE TO CHECK IF THE SHA-256 MATCHES WHAT WAS SENT PREVIOUSLY 
;; IF NOT BLACKLIST THE TEST CREATOR FOR FUTURE TESTS AND MAYBE RETURN 0% ELSE RETURN 25% BACK ETC
 ( begin
  (asserts! (>= block-height (unwrap! (get test_grade_starting_at_block (map-get? test_details {id: test_id})) (err u101))  ) ERR_TEST_OPEN)
  ;; have to check if the tx-sender is the test creator 
  (asserts! (is-eq tx-sender (unwrap! (get creator (map-get? test_details {id: test_id})) (err u101))  ) ERR_NOT_TEST_CREATOR)  
  (map-set answer_list_by_creator {test_id: test_id} {test_creator_id: tx-sender, answer_list: all_answers } )
  (ok true)
 
 )
)

;; CHECK FOR BLOCK HEIGHT AND > >= ???
(define-read-only (get_correct_answers (test_id uint) )
 ( begin
  (asserts! (>= block-height (unwrap! (get test_grade_starting_at_block (map-get? test_details {id: test_id})) (err u101))  ) ERR_TEST_LOCKED)
  (ok (unwrap! (get answer_list (map-get? answer_list_by_creator {test_id: test_id})) (err u1002)))
 )
)


;; func for answerers to provide the real answers string-ascii 20
( define-public (detailed_answers_by_test_takers (test_id uint) (given_answers (buff 256)) (secret (buff 256)) (user_answer_hash (buff 256)))
 ;; have to test if test_id is locked but rewards not given yet 
 ;; have to test if proof (aka user_answer hash) matches and if so add to list of people answering correctly 
 ( let
    (
        (user_answer_pre_hash (concat given_answers secret))
        (proof_matches (is-eq user_answer_hash (sha256 user_answer_pre_hash)) )
        (list_of_correct_answers (unwrap! (get answer_list (map-get? answer_list_by_creator {test_id: test_id})) (err u101)) )
        (points_scored (fold + (map verify_answer list_of_correct_answers given_answers) u0))
    )
    ;; HAVE TO ENSURE THAT THE PROOF ENTERED EARLIER MATCHES THE PROOF GIVEN NOW
    ;;(map-set test_taker_ans_hash {test_id: test_id, test_taker_id: tx-sender} {answer_hash: hash_of_answers } )
    (asserts! proof_matches ERR_PROOF_INCORRECT)

    ;; so test is locked since block height is greater 
    (asserts! (>= block-height (unwrap! (get test_grade_starting_at_block (map-get? test_details {id: test_id})) (err u101))  ) ERR_TEST_LOCKED)
    ;; but block height should be less than reward time - ux inconvenience though
    (asserts! (<= block-height (unwrap! (get test_grade_closed_at_block (map-get? test_details {id: test_id})) (err u101))  ) ERR_TEST_LOCKED)
    ;; have to check if the tx-sender is the one who set the proof
    ;;;(asserts! (is-eq tx-sender (unwrap! (get test_taker_id (map-get? test_taker_ans_hash {test_id: test_id})) (err 101))  ) ERR_TEST_LOCKED)
    ;; have to check if proof was submitted earlier and is same  
    ;;;(asserts! (is-eq proof  (unwrap! (map-get? test_taker_ans_hash {test_id: test_id, test_taker_id: tx-sender}) (err 101))  ) ERR_TEST_LOCKED)
    (asserts! (is-eq user_answer_hash (unwrap! (get answer_hash (map-get? test_taker_ans_hash {test_id: test_id, test_taker_id: tx-sender})) (err u101))  ) ERR_TEST_LOCKED)

    ;; and if answers correct then store the tx-sender info in successful list
    (if (> points_scored u8)
    ;;(map-set test_award_winners {test_id: test_id, test_taker_id: tx-sender} {answered_correctly: true } )
    (map-set test_award_winner_list {test_id: test_id} {test_winner_list: (unwrap-panic (as-max-len? (append (get-test-winners test_id) tx-sender) u100))})
    false    
    )
    (ok true)
 )
)

(define-private (get-test-winners (test_id uint))
    (default-to (list) (get test_winner_list (map-get? test_award_winner_list {test_id: test_id})))
)

;; a fn to check if answers are correct and if so add this tx-sender to the success list 
(define-private (verify_answer (correct_answers (buff 1)) (given_answers (buff 1)))
    (if (is-eq correct_answers given_answers) u1 u0)
)