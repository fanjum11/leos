
;; ACK - this code from the link below with some minor modifications 
;;https://bitbucket.org/SaadTahirTintash/velocity-charity-dao/src/master/ 


(impl-trait .edu-token-trait.edu-token-trait)

(define-constant ERR_NOT_TOKEN_OWNER (err u100))

(define-fungible-token edu-token)

(define-public (transfer? (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq sender tx-sender) ERR_NOT_TOKEN_OWNER)
    (ft-transfer? edu-token amount sender recipient)
  )
)

(define-read-only (get-balance (principal principal))
  (ok (ft-get-balance edu-token principal))
)

(define-public (mint (edu-token-amount uint) (sender principal))
  (ft-mint? edu-token edu-token-amount sender)
)

(define-public (burn (edu-token-amount uint))
  (ft-burn? edu-token edu-token-amount tx-sender)
)
