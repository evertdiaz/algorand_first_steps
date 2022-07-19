const algosdk = require('algosdk');
const crypto = require('crypto');

// Configuración del cliente y conexión al nodo
const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const algodServer = 'http://localhost'
const algodPort = 4001


let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort)

// Construimos la cuenta desde la frase mnemonic
const sender = algosdk.mnemonicToSecretKey("MNEMONIC_PHRASE")

// Funcion para ejecutar la creación del asset
async function createAsset(algodClient, sender) {
  const params = await algodClient.getTransactionParams().do()
  
  // Metadata
  const metadataJSON = {
    "title": "MNT",
    "description": "Mi Nuevo Token Unico",
    "image": "https://i.redd.it/qdb1m5x2i4i61.jpg"
  }

  // Construimos el Hash de la metadata
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(metadataJSON))
  const metadata = new Uint8Array(hash.digest());
  
  // Parametros para nuestro Asset
  const data = {
    from: sender.addr,
    uitName: "MNT",
    assetName: "Mi Nuevo Token No fungible",
    assetMetadataHash: metadata,
    total: 1,
    decimals: 0,
    suggestedParams: params
  }
  
  // Creamos la transacción
  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject(data);
  // Firmamos la transaccion
  const rawSignedTxn = txn.signTxn(sender.sk);
  // Ejecutamos la transacción
  const tx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
  const confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
  // Obtenemos la data de la transacción
  console.log(`Asset ID: ${confirmedTxn["asset-index"]} - Tx ID: ${tx.txId} - Ronda: ${confirmedTxn["confirmed-round"]}`)
}

createAsset(algodClient,sender);
