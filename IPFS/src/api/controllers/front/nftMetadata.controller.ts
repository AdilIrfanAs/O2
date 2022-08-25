import NftMetadata from '../../models/nftMetadata.model';

// API to create NftMetadata
export const create = async (req, res, next) => {
    try {
        let metadata = await NftMetadata.create(req.body);
        return res.send({ status: true, data: metadata });
    } catch (error) {
        return next(error);
    }
};

// API to get NftMetadata
export const get = async (req, res, next) => {
    try {
        const metadata: any = await NftMetadata.findOne({ _id: req.params.id })
        if (metadata)
            return res.send(metadata.metadata)
        else
            return res.json({ status: false, message: 'No record found' })
    } catch (error) {
        return next(error)
    }
}