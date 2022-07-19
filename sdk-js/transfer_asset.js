const algosdk = require('algosdk');

// Configuración del cliente y conexión al nodo
const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const algodServer = 'http://localhost'
const algodPort = 4001
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort)

// Construimos la cuenta desde la frase mnemonic
const sender = algosdk.mnemonicToSecretKey("MNEMONIC_PHRASE")
const receiver = "ADDRESS"

async function sendAsset(algodClient, sender, receiver) {
  const params = await algodClient.getTransactionParams().do()
  const transactionOptions = {
    from: sender.addr,
    to: receiver,
    amount: 1,
    assetIndex: 38,
    suggestedParams: params,
  };
  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(
    transactionOptions
  );
  // Firmamos la transaccion
  const rawSignedTxn = txn.signTxn(sender.sk);
  // Ejecutamos la transacción
  const tx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
  const confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
  // Obtenemos la data de la transacción
  console.log(`Transaccion ID: ${tx.txId}`)
}

sendAsset(algodClient, sender, receiver)