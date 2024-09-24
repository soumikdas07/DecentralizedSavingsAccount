let provider;
let signer;
let savingsContract;

const contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8"; // Replace with your deployed contract address
const abi = 
    [
        {
            "inputs": [],
            "name": "deposit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_interestRate",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "newRate",
                    "type": "uint256"
                }
            ],
            "name": "updateInterestRate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "balances",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "checkBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "depositTimestamps",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "interestRate",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

// Create a contract instance
async function createContractInstance() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    savingsContract = new ethers.Contract(contractAddress, abi, signer);
}

async function connectWallet() {
    if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        await createContractInstance();
        updateBalance();
    } else {
        alert("Please install MetaMask!");
    }
}

async function deposit() {
    const amount = document.getElementById('depositAmount').value;
    const tx = await savingsContract.deposit({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    document.getElementById('message').innerText = "Deposit successful!";
    updateBalance();
}

async function withdraw() {
    const amount = document.getElementById('withdrawAmount').value;
    const tx = await savingsContract.withdraw(ethers.utils.parseEther(amount));
    await tx.wait();
    document.getElementById('message').innerText = "Withdrawal successful!";
    updateBalance();
}

async function updateBalance() {
    try {
        const balance = await savingsContract.checkBalance();
        document.getElementById('balance').innerText = ethers.utils.formatEther(balance);
    } catch (error) {
        document.getElementById('error').innerText = "Error fetching balance: " + error.message;
    }
}
