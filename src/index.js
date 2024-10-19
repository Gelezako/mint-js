const { NearContract, NearBindgen, call, view, near } = require('near-sdk-js');

class TokenMetadata {
  constructor({ title, description, media }) {
    this.title = title;
    this.description = description;
    this.media = media;
  }
}

class NFT {
  constructor({ owner_id, metadata }) {
    this.owner_id = owner_id;
    this.metadata = metadata;
  }
}

@NearBindgen
class Contract extends NearContract {
  constructor() {
    super();
    this.nfts = new Map();
  }

  @call
  mint_nft({ token_id, metadata }) {
    const owner_id = near.predecessorAccountId();
    const newNft = new NFT({ owner_id, metadata });
    this.nfts.set(token_id, newNft);
  }

  @view
  get_nft({ token_id }) {
    return this.nfts.get(token_id) || null;
  }

  @view
  get_tokens_by_owner({ owner_id }) {
    return Array.from(this.nfts.entries()).filter(([_, nft]) => nft.owner_id === owner_id).map(([token_id, _]) => token_id);
  }
}

module.exports = Contract;
