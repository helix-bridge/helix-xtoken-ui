const abi = [
  {
    inputs: [
      { internalType: "address", name: "_xRing", type: "address" },
      { internalType: "address", name: "_ring", type: "address" },
      { internalType: "address", name: "_xTokenIssuing", type: "address" },
      { internalType: "address", name: "_lockBox", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "transferId", type: "uint256" },
      { indexed: false, internalType: "address", name: "sender", type: "address" },
      { indexed: false, internalType: "address", name: "recipient", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "BurnAndXUnlock",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "transferId", type: "uint256" },
      { indexed: false, internalType: "address", name: "recipient", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "IssueRing",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "transferId", type: "uint256" },
      { indexed: false, internalType: "address", name: "originalSender", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "RollbackBurn",
    type: "event",
  },
  {
    inputs: [],
    name: "RING",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "XRING",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_recipient", type: "address" },
      { internalType: "address", name: "_rollbackAccount", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
      { internalType: "bytes", name: "_extData", type: "bytes" },
      { internalType: "bytes", name: "_extParams", type: "bytes" },
    ],
    name: "burnAndXUnlock",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "lockBox",
    outputs: [{ internalType: "contract IXRINGLockBox", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "senders",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_transferId", type: "uint256" },
      { internalType: "address", name: "_xToken", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "bytes", name: "extData", type: "bytes" },
    ],
    name: "xTokenCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "xTokenIssuing",
    outputs: [{ internalType: "contract IXTokenIssuing", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_transferId", type: "uint256" },
      { internalType: "address", name: "_xToken", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "xTokenRollbackCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
] as const;

export default abi;