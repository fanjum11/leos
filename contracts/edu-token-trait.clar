
(define-trait edu-token-trait
  (
    (transfer? (uint principal principal) (response bool uint))
    (get-balance (principal) (response uint uint))
    (mint (uint principal) (response bool uint))
    (burn (uint) (response bool uint))
  )
)
