import NonFungibleToken from Flow.NonFungibleToken
import RegistryInterface from Project.RegistryInterface
import RegistryService from Project.RegistryService

pub contract RegistrySampleContract: NonFungibleToken, RegistryInterface {

    // Maps an address (of the customer/DappContract) to the amount
    // of tenants they have for a specific RegistryContract.
    access(contract) var clientTenants: {Address: UInt64}
   
    // Add own EHR item
    pub resource interface ITenantMinter {
        access(contract) fun updateTotalSupply()
    }
    // Tenant
    //
    // Requirement that all conforming multitenant smart contracts have
    // to define a resource called Tenant to store all data and things
    // that would normally be saved to account storage in the contract's
    // init() function
    // 
    pub resource Tenant: ITenantMinter {
        
        pub var totalSupply: UInt64

        access(contract) fun updateTotalSupply() {
            self.totalSupply = self.totalSupply + (1 as UInt64)
        }

        access(contract) fun getTotalSupply(): UInt64 {
            return self.totalSupply
        }

        access(self) let minter: @NFTMinter

        pub fun minterRef(): &NFTMinter {
            return &self.minter as &NFTMinter
        }

        init() {
            self.totalSupply = 00

            self.minter <- create NFTMinter()
        }

        destroy() {
            destroy self.minter
        }
    }

    // instance
    // instance returns an Tenant resource.
    //
    pub fun instance(authNFT: &RegistryService.AuthNFT): @Tenant {
        let clientTenant = authNFT.owner!.address
        if let count = self.clientTenants[clientTenant] {
            self.clientTenants[clientTenant] = self.clientTenants[clientTenant]! + (1 as UInt64)
        } else {
            self.clientTenants[clientTenant] = (1 as UInt64)
        }

        return <-create Tenant()
    }

    // getTenants
    // getTenants returns clientTenants.
    //
    pub fun getTenants(): {Address: UInt64} {
        return self.clientTenants
    }

    // Named Paths
    //
    pub let TenantStoragePath: StoragePath
    pub let TenantPublicPath: PublicPath

    pub var totalSupply: UInt64
    // Events
    //
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    // NFT Resource
    //
    // Has an id field and a metadata dictionary that can hold
    // any extra information.
    //
    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64

        // pub var metadata: {String: String}

        // upon creating (or "minting") this NFT Resource,
        // we must pass in a reference to a Tenant to update its totalSupply.
        init(_tenant: &Tenant{ITenantMinter}) {
            // initialize NFT fields
            self.id = (1 as UInt64) //_tenant.getTotalSupply()
            // self.metadata = _metadata

            // update the Tenant's totalSupply
            _tenant.updateTotalSupply()
            // update the RegistrySampleContract's totalSupply
            // RegistrySampleContract.totalSupply = RegistrySampleContract.totalSupply + (1 as UInt64)
        }
    }

    pub resource interface INFTCollectionReviewer {
        // pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        // pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun getMetaData(): {String: String}
        // pub fun borrowEntireNFT(id: UInt64): &NFT? {
        //     // If the result isn't nil, the id of the returned reference
        //     // should be the same as the argument to the function
        //     post {
        //         (result == nil) || (result?.id == id): 
        //             "Cannot borrow NFT reference: The ID of the returned reference is incorrect"
        //     }
        // }
    }

    // Collection
    // 
    // A basic NFT Collection
    //
    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, INFTCollectionReviewer {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        pub var metaData: {String: String}
        
        init () {
            self.ownedNFTs <- {}
            self.metaData = {}
        }

        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // deposit takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @RegistrySampleContract.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun getMetaData(): {String: String} {
            return self.metaData
        }
        // // borrowNFT gets a reference to an NFT in the collection
        // // so that the caller can read its id and call its methods
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        // // borrowEntireNFT gets a reference to an NFT in the collection
        // // so that the caller can read its id & metadata and call its methods
        // pub fun borrowEntireNFT(id: UInt64): &NFT? {
        //     if self.ownedNFTs[id] != nil {
        //         let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
        //         return ref as! &NFT
        //     } else {
        //         return nil
        //     }
        // }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // public function that anyone can call to create a new empty collection
    //
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    // NFTMinter
    //
    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
    //
    pub resource NFTMinter {

        // mintNFT
        //
        // mintNFT mints a new NFT with a new ID and metadata
        // and deposits it in the recipients collection using 
        // their collection reference
        //
        pub fun mintNFT(tenant: &Tenant{ITenantMinter}, recipient: &RegistrySampleContract.Collection{NonFungibleToken.CollectionPublic}) {

            // create a new NFT
            var newNFT <- create NFT(_tenant: tenant)

            // deposit it in the recipient's account using their reference
            recipient.deposit(token: <-newNFT)
        }
    }

    init() {
        // Initialize clientTenants
        self.totalSupply = 0
        self.clientTenants = {}

        // Set Named paths
        self.TenantStoragePath = /storage/RegistrySampleContractTenant
        self.TenantPublicPath = /public/RegistrySampleContractTenant
    }
}