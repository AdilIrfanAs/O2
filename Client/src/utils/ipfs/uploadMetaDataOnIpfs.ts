import ipfsAPI from 'ipfs-api';
const projectId = '';
const projectSecret = '';
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const ipfs = ipfsAPI({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth
    }
})
export const UploadToIPFS = async (metadataContent: any) => {
    try {
        let uri = ''
        let testBuffer = Buffer.from(JSON.stringify(metadataContent));
        let res = await ipfs.add(testBuffer)

        uri = `https://ipfs.io/ipfs/${res[0].hash}`
        return uri

    }
    catch (e) {
        console.log(e)
    }

}