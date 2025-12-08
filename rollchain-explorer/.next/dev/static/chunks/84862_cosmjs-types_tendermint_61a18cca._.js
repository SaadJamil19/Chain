(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/crypto/proof.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ProofOps = exports.ProofOp = exports.DominoOp = exports.ValueOp = exports.Proof = exports.protobufPackage = void 0;
/* eslint-disable */ const binary_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/binary.js [client] (ecmascript)");
const helpers_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/helpers.js [client] (ecmascript)");
exports.protobufPackage = "tendermint.crypto";
function createBaseProof() {
    return {
        total: BigInt(0),
        index: BigInt(0),
        leafHash: new Uint8Array(),
        aunts: []
    };
}
exports.Proof = {
    typeUrl: "/tendermint.crypto.Proof",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.total !== BigInt(0)) {
            writer.uint32(8).int64(message.total);
        }
        if (message.index !== BigInt(0)) {
            writer.uint32(16).int64(message.index);
        }
        if (message.leafHash.length !== 0) {
            writer.uint32(26).bytes(message.leafHash);
        }
        for (const v of message.aunts){
            writer.uint32(34).bytes(v);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProof();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.total = reader.int64();
                    break;
                case 2:
                    message.index = reader.int64();
                    break;
                case 3:
                    message.leafHash = reader.bytes();
                    break;
                case 4:
                    message.aunts.push(reader.bytes());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseProof();
        if ((0, helpers_1.isSet)(object.total)) obj.total = BigInt(object.total.toString());
        if ((0, helpers_1.isSet)(object.index)) obj.index = BigInt(object.index.toString());
        if ((0, helpers_1.isSet)(object.leafHash)) obj.leafHash = (0, helpers_1.bytesFromBase64)(object.leafHash);
        if (Array.isArray(object?.aunts)) obj.aunts = object.aunts.map((e)=>(0, helpers_1.bytesFromBase64)(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.total !== undefined && (obj.total = (message.total || BigInt(0)).toString());
        message.index !== undefined && (obj.index = (message.index || BigInt(0)).toString());
        message.leafHash !== undefined && (obj.leafHash = (0, helpers_1.base64FromBytes)(message.leafHash !== undefined ? message.leafHash : new Uint8Array()));
        if (message.aunts) {
            obj.aunts = message.aunts.map((e)=>(0, helpers_1.base64FromBytes)(e !== undefined ? e : new Uint8Array()));
        } else {
            obj.aunts = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseProof();
        if (object.total !== undefined && object.total !== null) {
            message.total = BigInt(object.total.toString());
        }
        if (object.index !== undefined && object.index !== null) {
            message.index = BigInt(object.index.toString());
        }
        message.leafHash = object.leafHash ?? new Uint8Array();
        message.aunts = object.aunts?.map((e)=>e) || [];
        return message;
    }
};
function createBaseValueOp() {
    return {
        key: new Uint8Array(),
        proof: undefined
    };
}
exports.ValueOp = {
    typeUrl: "/tendermint.crypto.ValueOp",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.key.length !== 0) {
            writer.uint32(10).bytes(message.key);
        }
        if (message.proof !== undefined) {
            exports.Proof.encode(message.proof, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseValueOp();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.key = reader.bytes();
                    break;
                case 2:
                    message.proof = exports.Proof.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseValueOp();
        if ((0, helpers_1.isSet)(object.key)) obj.key = (0, helpers_1.bytesFromBase64)(object.key);
        if ((0, helpers_1.isSet)(object.proof)) obj.proof = exports.Proof.fromJSON(object.proof);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.key !== undefined && (obj.key = (0, helpers_1.base64FromBytes)(message.key !== undefined ? message.key : new Uint8Array()));
        message.proof !== undefined && (obj.proof = message.proof ? exports.Proof.toJSON(message.proof) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseValueOp();
        message.key = object.key ?? new Uint8Array();
        if (object.proof !== undefined && object.proof !== null) {
            message.proof = exports.Proof.fromPartial(object.proof);
        }
        return message;
    }
};
function createBaseDominoOp() {
    return {
        key: "",
        input: "",
        output: ""
    };
}
exports.DominoOp = {
    typeUrl: "/tendermint.crypto.DominoOp",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.input !== "") {
            writer.uint32(18).string(message.input);
        }
        if (message.output !== "") {
            writer.uint32(26).string(message.output);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDominoOp();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.input = reader.string();
                    break;
                case 3:
                    message.output = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseDominoOp();
        if ((0, helpers_1.isSet)(object.key)) obj.key = String(object.key);
        if ((0, helpers_1.isSet)(object.input)) obj.input = String(object.input);
        if ((0, helpers_1.isSet)(object.output)) obj.output = String(object.output);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.input !== undefined && (obj.input = message.input);
        message.output !== undefined && (obj.output = message.output);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseDominoOp();
        message.key = object.key ?? "";
        message.input = object.input ?? "";
        message.output = object.output ?? "";
        return message;
    }
};
function createBaseProofOp() {
    return {
        type: "",
        key: new Uint8Array(),
        data: new Uint8Array()
    };
}
exports.ProofOp = {
    typeUrl: "/tendermint.crypto.ProofOp",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.type !== "") {
            writer.uint32(10).string(message.type);
        }
        if (message.key.length !== 0) {
            writer.uint32(18).bytes(message.key);
        }
        if (message.data.length !== 0) {
            writer.uint32(26).bytes(message.data);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProofOp();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.type = reader.string();
                    break;
                case 2:
                    message.key = reader.bytes();
                    break;
                case 3:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseProofOp();
        if ((0, helpers_1.isSet)(object.type)) obj.type = String(object.type);
        if ((0, helpers_1.isSet)(object.key)) obj.key = (0, helpers_1.bytesFromBase64)(object.key);
        if ((0, helpers_1.isSet)(object.data)) obj.data = (0, helpers_1.bytesFromBase64)(object.data);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.type !== undefined && (obj.type = message.type);
        message.key !== undefined && (obj.key = (0, helpers_1.base64FromBytes)(message.key !== undefined ? message.key : new Uint8Array()));
        message.data !== undefined && (obj.data = (0, helpers_1.base64FromBytes)(message.data !== undefined ? message.data : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseProofOp();
        message.type = object.type ?? "";
        message.key = object.key ?? new Uint8Array();
        message.data = object.data ?? new Uint8Array();
        return message;
    }
};
function createBaseProofOps() {
    return {
        ops: []
    };
}
exports.ProofOps = {
    typeUrl: "/tendermint.crypto.ProofOps",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.ops){
            exports.ProofOp.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProofOps();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.ops.push(exports.ProofOp.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseProofOps();
        if (Array.isArray(object?.ops)) obj.ops = object.ops.map((e)=>exports.ProofOp.fromJSON(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        if (message.ops) {
            obj.ops = message.ops.map((e)=>e ? exports.ProofOp.toJSON(e) : undefined);
        } else {
            obj.ops = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseProofOps();
        message.ops = object.ops?.map((e)=>exports.ProofOp.fromPartial(e)) || [];
        return message;
    }
}; //# sourceMappingURL=proof.js.map
}),
"[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/version/types.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Consensus = exports.App = exports.protobufPackage = void 0;
/* eslint-disable */ const binary_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/binary.js [client] (ecmascript)");
const helpers_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/helpers.js [client] (ecmascript)");
exports.protobufPackage = "tendermint.version";
function createBaseApp() {
    return {
        protocol: BigInt(0),
        software: ""
    };
}
exports.App = {
    typeUrl: "/tendermint.version.App",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.protocol !== BigInt(0)) {
            writer.uint32(8).uint64(message.protocol);
        }
        if (message.software !== "") {
            writer.uint32(18).string(message.software);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseApp();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.protocol = reader.uint64();
                    break;
                case 2:
                    message.software = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseApp();
        if ((0, helpers_1.isSet)(object.protocol)) obj.protocol = BigInt(object.protocol.toString());
        if ((0, helpers_1.isSet)(object.software)) obj.software = String(object.software);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.protocol !== undefined && (obj.protocol = (message.protocol || BigInt(0)).toString());
        message.software !== undefined && (obj.software = message.software);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseApp();
        if (object.protocol !== undefined && object.protocol !== null) {
            message.protocol = BigInt(object.protocol.toString());
        }
        message.software = object.software ?? "";
        return message;
    }
};
function createBaseConsensus() {
    return {
        block: BigInt(0),
        app: BigInt(0)
    };
}
exports.Consensus = {
    typeUrl: "/tendermint.version.Consensus",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.block !== BigInt(0)) {
            writer.uint32(8).uint64(message.block);
        }
        if (message.app !== BigInt(0)) {
            writer.uint32(16).uint64(message.app);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseConsensus();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.block = reader.uint64();
                    break;
                case 2:
                    message.app = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseConsensus();
        if ((0, helpers_1.isSet)(object.block)) obj.block = BigInt(object.block.toString());
        if ((0, helpers_1.isSet)(object.app)) obj.app = BigInt(object.app.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.block !== undefined && (obj.block = (message.block || BigInt(0)).toString());
        message.app !== undefined && (obj.app = (message.app || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseConsensus();
        if (object.block !== undefined && object.block !== null) {
            message.block = BigInt(object.block.toString());
        }
        if (object.app !== undefined && object.app !== null) {
            message.app = BigInt(object.app.toString());
        }
        return message;
    }
}; //# sourceMappingURL=types.js.map
}),
"[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/crypto/keys.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PublicKey = exports.protobufPackage = void 0;
/* eslint-disable */ const binary_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/binary.js [client] (ecmascript)");
const helpers_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/helpers.js [client] (ecmascript)");
exports.protobufPackage = "tendermint.crypto";
function createBasePublicKey() {
    return {
        ed25519: undefined,
        secp256k1: undefined
    };
}
exports.PublicKey = {
    typeUrl: "/tendermint.crypto.PublicKey",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.ed25519 !== undefined) {
            writer.uint32(10).bytes(message.ed25519);
        }
        if (message.secp256k1 !== undefined) {
            writer.uint32(18).bytes(message.secp256k1);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePublicKey();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.ed25519 = reader.bytes();
                    break;
                case 2:
                    message.secp256k1 = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBasePublicKey();
        if ((0, helpers_1.isSet)(object.ed25519)) obj.ed25519 = (0, helpers_1.bytesFromBase64)(object.ed25519);
        if ((0, helpers_1.isSet)(object.secp256k1)) obj.secp256k1 = (0, helpers_1.bytesFromBase64)(object.secp256k1);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.ed25519 !== undefined && (obj.ed25519 = message.ed25519 !== undefined ? (0, helpers_1.base64FromBytes)(message.ed25519) : undefined);
        message.secp256k1 !== undefined && (obj.secp256k1 = message.secp256k1 !== undefined ? (0, helpers_1.base64FromBytes)(message.secp256k1) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBasePublicKey();
        message.ed25519 = object.ed25519 ?? undefined;
        message.secp256k1 = object.secp256k1 ?? undefined;
        return message;
    }
}; //# sourceMappingURL=keys.js.map
}),
"[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/types/validator.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SimpleValidator = exports.Validator = exports.ValidatorSet = exports.protobufPackage = void 0;
/* eslint-disable */ const keys_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/crypto/keys.js [client] (ecmascript)");
const binary_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/binary.js [client] (ecmascript)");
const helpers_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/helpers.js [client] (ecmascript)");
exports.protobufPackage = "tendermint.types";
function createBaseValidatorSet() {
    return {
        validators: [],
        proposer: undefined,
        totalVotingPower: BigInt(0)
    };
}
exports.ValidatorSet = {
    typeUrl: "/tendermint.types.ValidatorSet",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.validators){
            exports.Validator.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.proposer !== undefined) {
            exports.Validator.encode(message.proposer, writer.uint32(18).fork()).ldelim();
        }
        if (message.totalVotingPower !== BigInt(0)) {
            writer.uint32(24).int64(message.totalVotingPower);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseValidatorSet();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.validators.push(exports.Validator.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.proposer = exports.Validator.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.totalVotingPower = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseValidatorSet();
        if (Array.isArray(object?.validators)) obj.validators = object.validators.map((e)=>exports.Validator.fromJSON(e));
        if ((0, helpers_1.isSet)(object.proposer)) obj.proposer = exports.Validator.fromJSON(object.proposer);
        if ((0, helpers_1.isSet)(object.totalVotingPower)) obj.totalVotingPower = BigInt(object.totalVotingPower.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        if (message.validators) {
            obj.validators = message.validators.map((e)=>e ? exports.Validator.toJSON(e) : undefined);
        } else {
            obj.validators = [];
        }
        message.proposer !== undefined && (obj.proposer = message.proposer ? exports.Validator.toJSON(message.proposer) : undefined);
        message.totalVotingPower !== undefined && (obj.totalVotingPower = (message.totalVotingPower || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseValidatorSet();
        message.validators = object.validators?.map((e)=>exports.Validator.fromPartial(e)) || [];
        if (object.proposer !== undefined && object.proposer !== null) {
            message.proposer = exports.Validator.fromPartial(object.proposer);
        }
        if (object.totalVotingPower !== undefined && object.totalVotingPower !== null) {
            message.totalVotingPower = BigInt(object.totalVotingPower.toString());
        }
        return message;
    }
};
function createBaseValidator() {
    return {
        address: new Uint8Array(),
        pubKey: keys_1.PublicKey.fromPartial({}),
        votingPower: BigInt(0),
        proposerPriority: BigInt(0)
    };
}
exports.Validator = {
    typeUrl: "/tendermint.types.Validator",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.address.length !== 0) {
            writer.uint32(10).bytes(message.address);
        }
        if (message.pubKey !== undefined) {
            keys_1.PublicKey.encode(message.pubKey, writer.uint32(18).fork()).ldelim();
        }
        if (message.votingPower !== BigInt(0)) {
            writer.uint32(24).int64(message.votingPower);
        }
        if (message.proposerPriority !== BigInt(0)) {
            writer.uint32(32).int64(message.proposerPriority);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseValidator();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.address = reader.bytes();
                    break;
                case 2:
                    message.pubKey = keys_1.PublicKey.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.votingPower = reader.int64();
                    break;
                case 4:
                    message.proposerPriority = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseValidator();
        if ((0, helpers_1.isSet)(object.address)) obj.address = (0, helpers_1.bytesFromBase64)(object.address);
        if ((0, helpers_1.isSet)(object.pubKey)) obj.pubKey = keys_1.PublicKey.fromJSON(object.pubKey);
        if ((0, helpers_1.isSet)(object.votingPower)) obj.votingPower = BigInt(object.votingPower.toString());
        if ((0, helpers_1.isSet)(object.proposerPriority)) obj.proposerPriority = BigInt(object.proposerPriority.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.address !== undefined && (obj.address = (0, helpers_1.base64FromBytes)(message.address !== undefined ? message.address : new Uint8Array()));
        message.pubKey !== undefined && (obj.pubKey = message.pubKey ? keys_1.PublicKey.toJSON(message.pubKey) : undefined);
        message.votingPower !== undefined && (obj.votingPower = (message.votingPower || BigInt(0)).toString());
        message.proposerPriority !== undefined && (obj.proposerPriority = (message.proposerPriority || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseValidator();
        message.address = object.address ?? new Uint8Array();
        if (object.pubKey !== undefined && object.pubKey !== null) {
            message.pubKey = keys_1.PublicKey.fromPartial(object.pubKey);
        }
        if (object.votingPower !== undefined && object.votingPower !== null) {
            message.votingPower = BigInt(object.votingPower.toString());
        }
        if (object.proposerPriority !== undefined && object.proposerPriority !== null) {
            message.proposerPriority = BigInt(object.proposerPriority.toString());
        }
        return message;
    }
};
function createBaseSimpleValidator() {
    return {
        pubKey: undefined,
        votingPower: BigInt(0)
    };
}
exports.SimpleValidator = {
    typeUrl: "/tendermint.types.SimpleValidator",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.pubKey !== undefined) {
            keys_1.PublicKey.encode(message.pubKey, writer.uint32(10).fork()).ldelim();
        }
        if (message.votingPower !== BigInt(0)) {
            writer.uint32(16).int64(message.votingPower);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSimpleValidator();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.pubKey = keys_1.PublicKey.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.votingPower = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseSimpleValidator();
        if ((0, helpers_1.isSet)(object.pubKey)) obj.pubKey = keys_1.PublicKey.fromJSON(object.pubKey);
        if ((0, helpers_1.isSet)(object.votingPower)) obj.votingPower = BigInt(object.votingPower.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.pubKey !== undefined && (obj.pubKey = message.pubKey ? keys_1.PublicKey.toJSON(message.pubKey) : undefined);
        message.votingPower !== undefined && (obj.votingPower = (message.votingPower || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseSimpleValidator();
        if (object.pubKey !== undefined && object.pubKey !== null) {
            message.pubKey = keys_1.PublicKey.fromPartial(object.pubKey);
        }
        if (object.votingPower !== undefined && object.votingPower !== null) {
            message.votingPower = BigInt(object.votingPower.toString());
        }
        return message;
    }
}; //# sourceMappingURL=validator.js.map
}),
"[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/types/types.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TxProof = exports.BlockMeta = exports.LightBlock = exports.SignedHeader = exports.Proposal = exports.CommitSig = exports.Commit = exports.Vote = exports.Data = exports.Header = exports.BlockID = exports.Part = exports.PartSetHeader = exports.signedMsgTypeToJSON = exports.signedMsgTypeFromJSON = exports.SignedMsgType = exports.blockIDFlagToJSON = exports.blockIDFlagFromJSON = exports.BlockIDFlag = exports.protobufPackage = void 0;
/* eslint-disable */ const proof_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/crypto/proof.js [client] (ecmascript)");
const types_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/version/types.js [client] (ecmascript)");
const timestamp_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/google/protobuf/timestamp.js [client] (ecmascript)");
const validator_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/types/validator.js [client] (ecmascript)");
const binary_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/binary.js [client] (ecmascript)");
const helpers_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/helpers.js [client] (ecmascript)");
exports.protobufPackage = "tendermint.types";
/** BlockIdFlag indicates which BlcokID the signature is for */ var BlockIDFlag;
(function(BlockIDFlag) {
    BlockIDFlag[BlockIDFlag["BLOCK_ID_FLAG_UNKNOWN"] = 0] = "BLOCK_ID_FLAG_UNKNOWN";
    BlockIDFlag[BlockIDFlag["BLOCK_ID_FLAG_ABSENT"] = 1] = "BLOCK_ID_FLAG_ABSENT";
    BlockIDFlag[BlockIDFlag["BLOCK_ID_FLAG_COMMIT"] = 2] = "BLOCK_ID_FLAG_COMMIT";
    BlockIDFlag[BlockIDFlag["BLOCK_ID_FLAG_NIL"] = 3] = "BLOCK_ID_FLAG_NIL";
    BlockIDFlag[BlockIDFlag["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(BlockIDFlag || (exports.BlockIDFlag = BlockIDFlag = {}));
function blockIDFlagFromJSON(object) {
    switch(object){
        case 0:
        case "BLOCK_ID_FLAG_UNKNOWN":
            return BlockIDFlag.BLOCK_ID_FLAG_UNKNOWN;
        case 1:
        case "BLOCK_ID_FLAG_ABSENT":
            return BlockIDFlag.BLOCK_ID_FLAG_ABSENT;
        case 2:
        case "BLOCK_ID_FLAG_COMMIT":
            return BlockIDFlag.BLOCK_ID_FLAG_COMMIT;
        case 3:
        case "BLOCK_ID_FLAG_NIL":
            return BlockIDFlag.BLOCK_ID_FLAG_NIL;
        case -1:
        case "UNRECOGNIZED":
        default:
            return BlockIDFlag.UNRECOGNIZED;
    }
}
exports.blockIDFlagFromJSON = blockIDFlagFromJSON;
function blockIDFlagToJSON(object) {
    switch(object){
        case BlockIDFlag.BLOCK_ID_FLAG_UNKNOWN:
            return "BLOCK_ID_FLAG_UNKNOWN";
        case BlockIDFlag.BLOCK_ID_FLAG_ABSENT:
            return "BLOCK_ID_FLAG_ABSENT";
        case BlockIDFlag.BLOCK_ID_FLAG_COMMIT:
            return "BLOCK_ID_FLAG_COMMIT";
        case BlockIDFlag.BLOCK_ID_FLAG_NIL:
            return "BLOCK_ID_FLAG_NIL";
        case BlockIDFlag.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.blockIDFlagToJSON = blockIDFlagToJSON;
/** SignedMsgType is a type of signed message in the consensus. */ var SignedMsgType;
(function(SignedMsgType) {
    SignedMsgType[SignedMsgType["SIGNED_MSG_TYPE_UNKNOWN"] = 0] = "SIGNED_MSG_TYPE_UNKNOWN";
    /** SIGNED_MSG_TYPE_PREVOTE - Votes */ SignedMsgType[SignedMsgType["SIGNED_MSG_TYPE_PREVOTE"] = 1] = "SIGNED_MSG_TYPE_PREVOTE";
    SignedMsgType[SignedMsgType["SIGNED_MSG_TYPE_PRECOMMIT"] = 2] = "SIGNED_MSG_TYPE_PRECOMMIT";
    /** SIGNED_MSG_TYPE_PROPOSAL - Proposals */ SignedMsgType[SignedMsgType["SIGNED_MSG_TYPE_PROPOSAL"] = 32] = "SIGNED_MSG_TYPE_PROPOSAL";
    SignedMsgType[SignedMsgType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SignedMsgType || (exports.SignedMsgType = SignedMsgType = {}));
function signedMsgTypeFromJSON(object) {
    switch(object){
        case 0:
        case "SIGNED_MSG_TYPE_UNKNOWN":
            return SignedMsgType.SIGNED_MSG_TYPE_UNKNOWN;
        case 1:
        case "SIGNED_MSG_TYPE_PREVOTE":
            return SignedMsgType.SIGNED_MSG_TYPE_PREVOTE;
        case 2:
        case "SIGNED_MSG_TYPE_PRECOMMIT":
            return SignedMsgType.SIGNED_MSG_TYPE_PRECOMMIT;
        case 32:
        case "SIGNED_MSG_TYPE_PROPOSAL":
            return SignedMsgType.SIGNED_MSG_TYPE_PROPOSAL;
        case -1:
        case "UNRECOGNIZED":
        default:
            return SignedMsgType.UNRECOGNIZED;
    }
}
exports.signedMsgTypeFromJSON = signedMsgTypeFromJSON;
function signedMsgTypeToJSON(object) {
    switch(object){
        case SignedMsgType.SIGNED_MSG_TYPE_UNKNOWN:
            return "SIGNED_MSG_TYPE_UNKNOWN";
        case SignedMsgType.SIGNED_MSG_TYPE_PREVOTE:
            return "SIGNED_MSG_TYPE_PREVOTE";
        case SignedMsgType.SIGNED_MSG_TYPE_PRECOMMIT:
            return "SIGNED_MSG_TYPE_PRECOMMIT";
        case SignedMsgType.SIGNED_MSG_TYPE_PROPOSAL:
            return "SIGNED_MSG_TYPE_PROPOSAL";
        case SignedMsgType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.signedMsgTypeToJSON = signedMsgTypeToJSON;
function createBasePartSetHeader() {
    return {
        total: 0,
        hash: new Uint8Array()
    };
}
exports.PartSetHeader = {
    typeUrl: "/tendermint.types.PartSetHeader",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.total !== 0) {
            writer.uint32(8).uint32(message.total);
        }
        if (message.hash.length !== 0) {
            writer.uint32(18).bytes(message.hash);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePartSetHeader();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.total = reader.uint32();
                    break;
                case 2:
                    message.hash = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBasePartSetHeader();
        if ((0, helpers_1.isSet)(object.total)) obj.total = Number(object.total);
        if ((0, helpers_1.isSet)(object.hash)) obj.hash = (0, helpers_1.bytesFromBase64)(object.hash);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.total !== undefined && (obj.total = Math.round(message.total));
        message.hash !== undefined && (obj.hash = (0, helpers_1.base64FromBytes)(message.hash !== undefined ? message.hash : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBasePartSetHeader();
        message.total = object.total ?? 0;
        message.hash = object.hash ?? new Uint8Array();
        return message;
    }
};
function createBasePart() {
    return {
        index: 0,
        bytes: new Uint8Array(),
        proof: proof_1.Proof.fromPartial({})
    };
}
exports.Part = {
    typeUrl: "/tendermint.types.Part",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.index !== 0) {
            writer.uint32(8).uint32(message.index);
        }
        if (message.bytes.length !== 0) {
            writer.uint32(18).bytes(message.bytes);
        }
        if (message.proof !== undefined) {
            proof_1.Proof.encode(message.proof, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePart();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.index = reader.uint32();
                    break;
                case 2:
                    message.bytes = reader.bytes();
                    break;
                case 3:
                    message.proof = proof_1.Proof.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBasePart();
        if ((0, helpers_1.isSet)(object.index)) obj.index = Number(object.index);
        if ((0, helpers_1.isSet)(object.bytes)) obj.bytes = (0, helpers_1.bytesFromBase64)(object.bytes);
        if ((0, helpers_1.isSet)(object.proof)) obj.proof = proof_1.Proof.fromJSON(object.proof);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.index !== undefined && (obj.index = Math.round(message.index));
        message.bytes !== undefined && (obj.bytes = (0, helpers_1.base64FromBytes)(message.bytes !== undefined ? message.bytes : new Uint8Array()));
        message.proof !== undefined && (obj.proof = message.proof ? proof_1.Proof.toJSON(message.proof) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBasePart();
        message.index = object.index ?? 0;
        message.bytes = object.bytes ?? new Uint8Array();
        if (object.proof !== undefined && object.proof !== null) {
            message.proof = proof_1.Proof.fromPartial(object.proof);
        }
        return message;
    }
};
function createBaseBlockID() {
    return {
        hash: new Uint8Array(),
        partSetHeader: exports.PartSetHeader.fromPartial({})
    };
}
exports.BlockID = {
    typeUrl: "/tendermint.types.BlockID",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.hash.length !== 0) {
            writer.uint32(10).bytes(message.hash);
        }
        if (message.partSetHeader !== undefined) {
            exports.PartSetHeader.encode(message.partSetHeader, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBlockID();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.hash = reader.bytes();
                    break;
                case 2:
                    message.partSetHeader = exports.PartSetHeader.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseBlockID();
        if ((0, helpers_1.isSet)(object.hash)) obj.hash = (0, helpers_1.bytesFromBase64)(object.hash);
        if ((0, helpers_1.isSet)(object.partSetHeader)) obj.partSetHeader = exports.PartSetHeader.fromJSON(object.partSetHeader);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.hash !== undefined && (obj.hash = (0, helpers_1.base64FromBytes)(message.hash !== undefined ? message.hash : new Uint8Array()));
        message.partSetHeader !== undefined && (obj.partSetHeader = message.partSetHeader ? exports.PartSetHeader.toJSON(message.partSetHeader) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseBlockID();
        message.hash = object.hash ?? new Uint8Array();
        if (object.partSetHeader !== undefined && object.partSetHeader !== null) {
            message.partSetHeader = exports.PartSetHeader.fromPartial(object.partSetHeader);
        }
        return message;
    }
};
function createBaseHeader() {
    return {
        version: types_1.Consensus.fromPartial({}),
        chainId: "",
        height: BigInt(0),
        time: timestamp_1.Timestamp.fromPartial({}),
        lastBlockId: exports.BlockID.fromPartial({}),
        lastCommitHash: new Uint8Array(),
        dataHash: new Uint8Array(),
        validatorsHash: new Uint8Array(),
        nextValidatorsHash: new Uint8Array(),
        consensusHash: new Uint8Array(),
        appHash: new Uint8Array(),
        lastResultsHash: new Uint8Array(),
        evidenceHash: new Uint8Array(),
        proposerAddress: new Uint8Array()
    };
}
exports.Header = {
    typeUrl: "/tendermint.types.Header",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.version !== undefined) {
            types_1.Consensus.encode(message.version, writer.uint32(10).fork()).ldelim();
        }
        if (message.chainId !== "") {
            writer.uint32(18).string(message.chainId);
        }
        if (message.height !== BigInt(0)) {
            writer.uint32(24).int64(message.height);
        }
        if (message.time !== undefined) {
            timestamp_1.Timestamp.encode(message.time, writer.uint32(34).fork()).ldelim();
        }
        if (message.lastBlockId !== undefined) {
            exports.BlockID.encode(message.lastBlockId, writer.uint32(42).fork()).ldelim();
        }
        if (message.lastCommitHash.length !== 0) {
            writer.uint32(50).bytes(message.lastCommitHash);
        }
        if (message.dataHash.length !== 0) {
            writer.uint32(58).bytes(message.dataHash);
        }
        if (message.validatorsHash.length !== 0) {
            writer.uint32(66).bytes(message.validatorsHash);
        }
        if (message.nextValidatorsHash.length !== 0) {
            writer.uint32(74).bytes(message.nextValidatorsHash);
        }
        if (message.consensusHash.length !== 0) {
            writer.uint32(82).bytes(message.consensusHash);
        }
        if (message.appHash.length !== 0) {
            writer.uint32(90).bytes(message.appHash);
        }
        if (message.lastResultsHash.length !== 0) {
            writer.uint32(98).bytes(message.lastResultsHash);
        }
        if (message.evidenceHash.length !== 0) {
            writer.uint32(106).bytes(message.evidenceHash);
        }
        if (message.proposerAddress.length !== 0) {
            writer.uint32(114).bytes(message.proposerAddress);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHeader();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.version = types_1.Consensus.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.chainId = reader.string();
                    break;
                case 3:
                    message.height = reader.int64();
                    break;
                case 4:
                    message.time = timestamp_1.Timestamp.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.lastBlockId = exports.BlockID.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.lastCommitHash = reader.bytes();
                    break;
                case 7:
                    message.dataHash = reader.bytes();
                    break;
                case 8:
                    message.validatorsHash = reader.bytes();
                    break;
                case 9:
                    message.nextValidatorsHash = reader.bytes();
                    break;
                case 10:
                    message.consensusHash = reader.bytes();
                    break;
                case 11:
                    message.appHash = reader.bytes();
                    break;
                case 12:
                    message.lastResultsHash = reader.bytes();
                    break;
                case 13:
                    message.evidenceHash = reader.bytes();
                    break;
                case 14:
                    message.proposerAddress = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseHeader();
        if ((0, helpers_1.isSet)(object.version)) obj.version = types_1.Consensus.fromJSON(object.version);
        if ((0, helpers_1.isSet)(object.chainId)) obj.chainId = String(object.chainId);
        if ((0, helpers_1.isSet)(object.height)) obj.height = BigInt(object.height.toString());
        if ((0, helpers_1.isSet)(object.time)) obj.time = (0, helpers_1.fromJsonTimestamp)(object.time);
        if ((0, helpers_1.isSet)(object.lastBlockId)) obj.lastBlockId = exports.BlockID.fromJSON(object.lastBlockId);
        if ((0, helpers_1.isSet)(object.lastCommitHash)) obj.lastCommitHash = (0, helpers_1.bytesFromBase64)(object.lastCommitHash);
        if ((0, helpers_1.isSet)(object.dataHash)) obj.dataHash = (0, helpers_1.bytesFromBase64)(object.dataHash);
        if ((0, helpers_1.isSet)(object.validatorsHash)) obj.validatorsHash = (0, helpers_1.bytesFromBase64)(object.validatorsHash);
        if ((0, helpers_1.isSet)(object.nextValidatorsHash)) obj.nextValidatorsHash = (0, helpers_1.bytesFromBase64)(object.nextValidatorsHash);
        if ((0, helpers_1.isSet)(object.consensusHash)) obj.consensusHash = (0, helpers_1.bytesFromBase64)(object.consensusHash);
        if ((0, helpers_1.isSet)(object.appHash)) obj.appHash = (0, helpers_1.bytesFromBase64)(object.appHash);
        if ((0, helpers_1.isSet)(object.lastResultsHash)) obj.lastResultsHash = (0, helpers_1.bytesFromBase64)(object.lastResultsHash);
        if ((0, helpers_1.isSet)(object.evidenceHash)) obj.evidenceHash = (0, helpers_1.bytesFromBase64)(object.evidenceHash);
        if ((0, helpers_1.isSet)(object.proposerAddress)) obj.proposerAddress = (0, helpers_1.bytesFromBase64)(object.proposerAddress);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.version !== undefined && (obj.version = message.version ? types_1.Consensus.toJSON(message.version) : undefined);
        message.chainId !== undefined && (obj.chainId = message.chainId);
        message.height !== undefined && (obj.height = (message.height || BigInt(0)).toString());
        message.time !== undefined && (obj.time = (0, helpers_1.fromTimestamp)(message.time).toISOString());
        message.lastBlockId !== undefined && (obj.lastBlockId = message.lastBlockId ? exports.BlockID.toJSON(message.lastBlockId) : undefined);
        message.lastCommitHash !== undefined && (obj.lastCommitHash = (0, helpers_1.base64FromBytes)(message.lastCommitHash !== undefined ? message.lastCommitHash : new Uint8Array()));
        message.dataHash !== undefined && (obj.dataHash = (0, helpers_1.base64FromBytes)(message.dataHash !== undefined ? message.dataHash : new Uint8Array()));
        message.validatorsHash !== undefined && (obj.validatorsHash = (0, helpers_1.base64FromBytes)(message.validatorsHash !== undefined ? message.validatorsHash : new Uint8Array()));
        message.nextValidatorsHash !== undefined && (obj.nextValidatorsHash = (0, helpers_1.base64FromBytes)(message.nextValidatorsHash !== undefined ? message.nextValidatorsHash : new Uint8Array()));
        message.consensusHash !== undefined && (obj.consensusHash = (0, helpers_1.base64FromBytes)(message.consensusHash !== undefined ? message.consensusHash : new Uint8Array()));
        message.appHash !== undefined && (obj.appHash = (0, helpers_1.base64FromBytes)(message.appHash !== undefined ? message.appHash : new Uint8Array()));
        message.lastResultsHash !== undefined && (obj.lastResultsHash = (0, helpers_1.base64FromBytes)(message.lastResultsHash !== undefined ? message.lastResultsHash : new Uint8Array()));
        message.evidenceHash !== undefined && (obj.evidenceHash = (0, helpers_1.base64FromBytes)(message.evidenceHash !== undefined ? message.evidenceHash : new Uint8Array()));
        message.proposerAddress !== undefined && (obj.proposerAddress = (0, helpers_1.base64FromBytes)(message.proposerAddress !== undefined ? message.proposerAddress : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseHeader();
        if (object.version !== undefined && object.version !== null) {
            message.version = types_1.Consensus.fromPartial(object.version);
        }
        message.chainId = object.chainId ?? "";
        if (object.height !== undefined && object.height !== null) {
            message.height = BigInt(object.height.toString());
        }
        if (object.time !== undefined && object.time !== null) {
            message.time = timestamp_1.Timestamp.fromPartial(object.time);
        }
        if (object.lastBlockId !== undefined && object.lastBlockId !== null) {
            message.lastBlockId = exports.BlockID.fromPartial(object.lastBlockId);
        }
        message.lastCommitHash = object.lastCommitHash ?? new Uint8Array();
        message.dataHash = object.dataHash ?? new Uint8Array();
        message.validatorsHash = object.validatorsHash ?? new Uint8Array();
        message.nextValidatorsHash = object.nextValidatorsHash ?? new Uint8Array();
        message.consensusHash = object.consensusHash ?? new Uint8Array();
        message.appHash = object.appHash ?? new Uint8Array();
        message.lastResultsHash = object.lastResultsHash ?? new Uint8Array();
        message.evidenceHash = object.evidenceHash ?? new Uint8Array();
        message.proposerAddress = object.proposerAddress ?? new Uint8Array();
        return message;
    }
};
function createBaseData() {
    return {
        txs: []
    };
}
exports.Data = {
    typeUrl: "/tendermint.types.Data",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.txs){
            writer.uint32(10).bytes(v);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseData();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.txs.push(reader.bytes());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseData();
        if (Array.isArray(object?.txs)) obj.txs = object.txs.map((e)=>(0, helpers_1.bytesFromBase64)(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        if (message.txs) {
            obj.txs = message.txs.map((e)=>(0, helpers_1.base64FromBytes)(e !== undefined ? e : new Uint8Array()));
        } else {
            obj.txs = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseData();
        message.txs = object.txs?.map((e)=>e) || [];
        return message;
    }
};
function createBaseVote() {
    return {
        type: 0,
        height: BigInt(0),
        round: 0,
        blockId: exports.BlockID.fromPartial({}),
        timestamp: timestamp_1.Timestamp.fromPartial({}),
        validatorAddress: new Uint8Array(),
        validatorIndex: 0,
        signature: new Uint8Array()
    };
}
exports.Vote = {
    typeUrl: "/tendermint.types.Vote",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.type !== 0) {
            writer.uint32(8).int32(message.type);
        }
        if (message.height !== BigInt(0)) {
            writer.uint32(16).int64(message.height);
        }
        if (message.round !== 0) {
            writer.uint32(24).int32(message.round);
        }
        if (message.blockId !== undefined) {
            exports.BlockID.encode(message.blockId, writer.uint32(34).fork()).ldelim();
        }
        if (message.timestamp !== undefined) {
            timestamp_1.Timestamp.encode(message.timestamp, writer.uint32(42).fork()).ldelim();
        }
        if (message.validatorAddress.length !== 0) {
            writer.uint32(50).bytes(message.validatorAddress);
        }
        if (message.validatorIndex !== 0) {
            writer.uint32(56).int32(message.validatorIndex);
        }
        if (message.signature.length !== 0) {
            writer.uint32(66).bytes(message.signature);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVote();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.height = reader.int64();
                    break;
                case 3:
                    message.round = reader.int32();
                    break;
                case 4:
                    message.blockId = exports.BlockID.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.timestamp = timestamp_1.Timestamp.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.validatorAddress = reader.bytes();
                    break;
                case 7:
                    message.validatorIndex = reader.int32();
                    break;
                case 8:
                    message.signature = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseVote();
        if ((0, helpers_1.isSet)(object.type)) obj.type = signedMsgTypeFromJSON(object.type);
        if ((0, helpers_1.isSet)(object.height)) obj.height = BigInt(object.height.toString());
        if ((0, helpers_1.isSet)(object.round)) obj.round = Number(object.round);
        if ((0, helpers_1.isSet)(object.blockId)) obj.blockId = exports.BlockID.fromJSON(object.blockId);
        if ((0, helpers_1.isSet)(object.timestamp)) obj.timestamp = (0, helpers_1.fromJsonTimestamp)(object.timestamp);
        if ((0, helpers_1.isSet)(object.validatorAddress)) obj.validatorAddress = (0, helpers_1.bytesFromBase64)(object.validatorAddress);
        if ((0, helpers_1.isSet)(object.validatorIndex)) obj.validatorIndex = Number(object.validatorIndex);
        if ((0, helpers_1.isSet)(object.signature)) obj.signature = (0, helpers_1.bytesFromBase64)(object.signature);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.type !== undefined && (obj.type = signedMsgTypeToJSON(message.type));
        message.height !== undefined && (obj.height = (message.height || BigInt(0)).toString());
        message.round !== undefined && (obj.round = Math.round(message.round));
        message.blockId !== undefined && (obj.blockId = message.blockId ? exports.BlockID.toJSON(message.blockId) : undefined);
        message.timestamp !== undefined && (obj.timestamp = (0, helpers_1.fromTimestamp)(message.timestamp).toISOString());
        message.validatorAddress !== undefined && (obj.validatorAddress = (0, helpers_1.base64FromBytes)(message.validatorAddress !== undefined ? message.validatorAddress : new Uint8Array()));
        message.validatorIndex !== undefined && (obj.validatorIndex = Math.round(message.validatorIndex));
        message.signature !== undefined && (obj.signature = (0, helpers_1.base64FromBytes)(message.signature !== undefined ? message.signature : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseVote();
        message.type = object.type ?? 0;
        if (object.height !== undefined && object.height !== null) {
            message.height = BigInt(object.height.toString());
        }
        message.round = object.round ?? 0;
        if (object.blockId !== undefined && object.blockId !== null) {
            message.blockId = exports.BlockID.fromPartial(object.blockId);
        }
        if (object.timestamp !== undefined && object.timestamp !== null) {
            message.timestamp = timestamp_1.Timestamp.fromPartial(object.timestamp);
        }
        message.validatorAddress = object.validatorAddress ?? new Uint8Array();
        message.validatorIndex = object.validatorIndex ?? 0;
        message.signature = object.signature ?? new Uint8Array();
        return message;
    }
};
function createBaseCommit() {
    return {
        height: BigInt(0),
        round: 0,
        blockId: exports.BlockID.fromPartial({}),
        signatures: []
    };
}
exports.Commit = {
    typeUrl: "/tendermint.types.Commit",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.height !== BigInt(0)) {
            writer.uint32(8).int64(message.height);
        }
        if (message.round !== 0) {
            writer.uint32(16).int32(message.round);
        }
        if (message.blockId !== undefined) {
            exports.BlockID.encode(message.blockId, writer.uint32(26).fork()).ldelim();
        }
        for (const v of message.signatures){
            exports.CommitSig.encode(v, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCommit();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.height = reader.int64();
                    break;
                case 2:
                    message.round = reader.int32();
                    break;
                case 3:
                    message.blockId = exports.BlockID.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.signatures.push(exports.CommitSig.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseCommit();
        if ((0, helpers_1.isSet)(object.height)) obj.height = BigInt(object.height.toString());
        if ((0, helpers_1.isSet)(object.round)) obj.round = Number(object.round);
        if ((0, helpers_1.isSet)(object.blockId)) obj.blockId = exports.BlockID.fromJSON(object.blockId);
        if (Array.isArray(object?.signatures)) obj.signatures = object.signatures.map((e)=>exports.CommitSig.fromJSON(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.height !== undefined && (obj.height = (message.height || BigInt(0)).toString());
        message.round !== undefined && (obj.round = Math.round(message.round));
        message.blockId !== undefined && (obj.blockId = message.blockId ? exports.BlockID.toJSON(message.blockId) : undefined);
        if (message.signatures) {
            obj.signatures = message.signatures.map((e)=>e ? exports.CommitSig.toJSON(e) : undefined);
        } else {
            obj.signatures = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseCommit();
        if (object.height !== undefined && object.height !== null) {
            message.height = BigInt(object.height.toString());
        }
        message.round = object.round ?? 0;
        if (object.blockId !== undefined && object.blockId !== null) {
            message.blockId = exports.BlockID.fromPartial(object.blockId);
        }
        message.signatures = object.signatures?.map((e)=>exports.CommitSig.fromPartial(e)) || [];
        return message;
    }
};
function createBaseCommitSig() {
    return {
        blockIdFlag: 0,
        validatorAddress: new Uint8Array(),
        timestamp: timestamp_1.Timestamp.fromPartial({}),
        signature: new Uint8Array()
    };
}
exports.CommitSig = {
    typeUrl: "/tendermint.types.CommitSig",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.blockIdFlag !== 0) {
            writer.uint32(8).int32(message.blockIdFlag);
        }
        if (message.validatorAddress.length !== 0) {
            writer.uint32(18).bytes(message.validatorAddress);
        }
        if (message.timestamp !== undefined) {
            timestamp_1.Timestamp.encode(message.timestamp, writer.uint32(26).fork()).ldelim();
        }
        if (message.signature.length !== 0) {
            writer.uint32(34).bytes(message.signature);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCommitSig();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.blockIdFlag = reader.int32();
                    break;
                case 2:
                    message.validatorAddress = reader.bytes();
                    break;
                case 3:
                    message.timestamp = timestamp_1.Timestamp.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.signature = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseCommitSig();
        if ((0, helpers_1.isSet)(object.blockIdFlag)) obj.blockIdFlag = blockIDFlagFromJSON(object.blockIdFlag);
        if ((0, helpers_1.isSet)(object.validatorAddress)) obj.validatorAddress = (0, helpers_1.bytesFromBase64)(object.validatorAddress);
        if ((0, helpers_1.isSet)(object.timestamp)) obj.timestamp = (0, helpers_1.fromJsonTimestamp)(object.timestamp);
        if ((0, helpers_1.isSet)(object.signature)) obj.signature = (0, helpers_1.bytesFromBase64)(object.signature);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.blockIdFlag !== undefined && (obj.blockIdFlag = blockIDFlagToJSON(message.blockIdFlag));
        message.validatorAddress !== undefined && (obj.validatorAddress = (0, helpers_1.base64FromBytes)(message.validatorAddress !== undefined ? message.validatorAddress : new Uint8Array()));
        message.timestamp !== undefined && (obj.timestamp = (0, helpers_1.fromTimestamp)(message.timestamp).toISOString());
        message.signature !== undefined && (obj.signature = (0, helpers_1.base64FromBytes)(message.signature !== undefined ? message.signature : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseCommitSig();
        message.blockIdFlag = object.blockIdFlag ?? 0;
        message.validatorAddress = object.validatorAddress ?? new Uint8Array();
        if (object.timestamp !== undefined && object.timestamp !== null) {
            message.timestamp = timestamp_1.Timestamp.fromPartial(object.timestamp);
        }
        message.signature = object.signature ?? new Uint8Array();
        return message;
    }
};
function createBaseProposal() {
    return {
        type: 0,
        height: BigInt(0),
        round: 0,
        polRound: 0,
        blockId: exports.BlockID.fromPartial({}),
        timestamp: timestamp_1.Timestamp.fromPartial({}),
        signature: new Uint8Array()
    };
}
exports.Proposal = {
    typeUrl: "/tendermint.types.Proposal",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.type !== 0) {
            writer.uint32(8).int32(message.type);
        }
        if (message.height !== BigInt(0)) {
            writer.uint32(16).int64(message.height);
        }
        if (message.round !== 0) {
            writer.uint32(24).int32(message.round);
        }
        if (message.polRound !== 0) {
            writer.uint32(32).int32(message.polRound);
        }
        if (message.blockId !== undefined) {
            exports.BlockID.encode(message.blockId, writer.uint32(42).fork()).ldelim();
        }
        if (message.timestamp !== undefined) {
            timestamp_1.Timestamp.encode(message.timestamp, writer.uint32(50).fork()).ldelim();
        }
        if (message.signature.length !== 0) {
            writer.uint32(58).bytes(message.signature);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProposal();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.height = reader.int64();
                    break;
                case 3:
                    message.round = reader.int32();
                    break;
                case 4:
                    message.polRound = reader.int32();
                    break;
                case 5:
                    message.blockId = exports.BlockID.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.timestamp = timestamp_1.Timestamp.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.signature = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseProposal();
        if ((0, helpers_1.isSet)(object.type)) obj.type = signedMsgTypeFromJSON(object.type);
        if ((0, helpers_1.isSet)(object.height)) obj.height = BigInt(object.height.toString());
        if ((0, helpers_1.isSet)(object.round)) obj.round = Number(object.round);
        if ((0, helpers_1.isSet)(object.polRound)) obj.polRound = Number(object.polRound);
        if ((0, helpers_1.isSet)(object.blockId)) obj.blockId = exports.BlockID.fromJSON(object.blockId);
        if ((0, helpers_1.isSet)(object.timestamp)) obj.timestamp = (0, helpers_1.fromJsonTimestamp)(object.timestamp);
        if ((0, helpers_1.isSet)(object.signature)) obj.signature = (0, helpers_1.bytesFromBase64)(object.signature);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.type !== undefined && (obj.type = signedMsgTypeToJSON(message.type));
        message.height !== undefined && (obj.height = (message.height || BigInt(0)).toString());
        message.round !== undefined && (obj.round = Math.round(message.round));
        message.polRound !== undefined && (obj.polRound = Math.round(message.polRound));
        message.blockId !== undefined && (obj.blockId = message.blockId ? exports.BlockID.toJSON(message.blockId) : undefined);
        message.timestamp !== undefined && (obj.timestamp = (0, helpers_1.fromTimestamp)(message.timestamp).toISOString());
        message.signature !== undefined && (obj.signature = (0, helpers_1.base64FromBytes)(message.signature !== undefined ? message.signature : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseProposal();
        message.type = object.type ?? 0;
        if (object.height !== undefined && object.height !== null) {
            message.height = BigInt(object.height.toString());
        }
        message.round = object.round ?? 0;
        message.polRound = object.polRound ?? 0;
        if (object.blockId !== undefined && object.blockId !== null) {
            message.blockId = exports.BlockID.fromPartial(object.blockId);
        }
        if (object.timestamp !== undefined && object.timestamp !== null) {
            message.timestamp = timestamp_1.Timestamp.fromPartial(object.timestamp);
        }
        message.signature = object.signature ?? new Uint8Array();
        return message;
    }
};
function createBaseSignedHeader() {
    return {
        header: undefined,
        commit: undefined
    };
}
exports.SignedHeader = {
    typeUrl: "/tendermint.types.SignedHeader",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.header !== undefined) {
            exports.Header.encode(message.header, writer.uint32(10).fork()).ldelim();
        }
        if (message.commit !== undefined) {
            exports.Commit.encode(message.commit, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSignedHeader();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.header = exports.Header.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.commit = exports.Commit.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseSignedHeader();
        if ((0, helpers_1.isSet)(object.header)) obj.header = exports.Header.fromJSON(object.header);
        if ((0, helpers_1.isSet)(object.commit)) obj.commit = exports.Commit.fromJSON(object.commit);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.header !== undefined && (obj.header = message.header ? exports.Header.toJSON(message.header) : undefined);
        message.commit !== undefined && (obj.commit = message.commit ? exports.Commit.toJSON(message.commit) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseSignedHeader();
        if (object.header !== undefined && object.header !== null) {
            message.header = exports.Header.fromPartial(object.header);
        }
        if (object.commit !== undefined && object.commit !== null) {
            message.commit = exports.Commit.fromPartial(object.commit);
        }
        return message;
    }
};
function createBaseLightBlock() {
    return {
        signedHeader: undefined,
        validatorSet: undefined
    };
}
exports.LightBlock = {
    typeUrl: "/tendermint.types.LightBlock",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.signedHeader !== undefined) {
            exports.SignedHeader.encode(message.signedHeader, writer.uint32(10).fork()).ldelim();
        }
        if (message.validatorSet !== undefined) {
            validator_1.ValidatorSet.encode(message.validatorSet, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLightBlock();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.signedHeader = exports.SignedHeader.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.validatorSet = validator_1.ValidatorSet.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseLightBlock();
        if ((0, helpers_1.isSet)(object.signedHeader)) obj.signedHeader = exports.SignedHeader.fromJSON(object.signedHeader);
        if ((0, helpers_1.isSet)(object.validatorSet)) obj.validatorSet = validator_1.ValidatorSet.fromJSON(object.validatorSet);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.signedHeader !== undefined && (obj.signedHeader = message.signedHeader ? exports.SignedHeader.toJSON(message.signedHeader) : undefined);
        message.validatorSet !== undefined && (obj.validatorSet = message.validatorSet ? validator_1.ValidatorSet.toJSON(message.validatorSet) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseLightBlock();
        if (object.signedHeader !== undefined && object.signedHeader !== null) {
            message.signedHeader = exports.SignedHeader.fromPartial(object.signedHeader);
        }
        if (object.validatorSet !== undefined && object.validatorSet !== null) {
            message.validatorSet = validator_1.ValidatorSet.fromPartial(object.validatorSet);
        }
        return message;
    }
};
function createBaseBlockMeta() {
    return {
        blockId: exports.BlockID.fromPartial({}),
        blockSize: BigInt(0),
        header: exports.Header.fromPartial({}),
        numTxs: BigInt(0)
    };
}
exports.BlockMeta = {
    typeUrl: "/tendermint.types.BlockMeta",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.blockId !== undefined) {
            exports.BlockID.encode(message.blockId, writer.uint32(10).fork()).ldelim();
        }
        if (message.blockSize !== BigInt(0)) {
            writer.uint32(16).int64(message.blockSize);
        }
        if (message.header !== undefined) {
            exports.Header.encode(message.header, writer.uint32(26).fork()).ldelim();
        }
        if (message.numTxs !== BigInt(0)) {
            writer.uint32(32).int64(message.numTxs);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBlockMeta();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.blockId = exports.BlockID.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.blockSize = reader.int64();
                    break;
                case 3:
                    message.header = exports.Header.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.numTxs = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseBlockMeta();
        if ((0, helpers_1.isSet)(object.blockId)) obj.blockId = exports.BlockID.fromJSON(object.blockId);
        if ((0, helpers_1.isSet)(object.blockSize)) obj.blockSize = BigInt(object.blockSize.toString());
        if ((0, helpers_1.isSet)(object.header)) obj.header = exports.Header.fromJSON(object.header);
        if ((0, helpers_1.isSet)(object.numTxs)) obj.numTxs = BigInt(object.numTxs.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.blockId !== undefined && (obj.blockId = message.blockId ? exports.BlockID.toJSON(message.blockId) : undefined);
        message.blockSize !== undefined && (obj.blockSize = (message.blockSize || BigInt(0)).toString());
        message.header !== undefined && (obj.header = message.header ? exports.Header.toJSON(message.header) : undefined);
        message.numTxs !== undefined && (obj.numTxs = (message.numTxs || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseBlockMeta();
        if (object.blockId !== undefined && object.blockId !== null) {
            message.blockId = exports.BlockID.fromPartial(object.blockId);
        }
        if (object.blockSize !== undefined && object.blockSize !== null) {
            message.blockSize = BigInt(object.blockSize.toString());
        }
        if (object.header !== undefined && object.header !== null) {
            message.header = exports.Header.fromPartial(object.header);
        }
        if (object.numTxs !== undefined && object.numTxs !== null) {
            message.numTxs = BigInt(object.numTxs.toString());
        }
        return message;
    }
};
function createBaseTxProof() {
    return {
        rootHash: new Uint8Array(),
        data: new Uint8Array(),
        proof: undefined
    };
}
exports.TxProof = {
    typeUrl: "/tendermint.types.TxProof",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.rootHash.length !== 0) {
            writer.uint32(10).bytes(message.rootHash);
        }
        if (message.data.length !== 0) {
            writer.uint32(18).bytes(message.data);
        }
        if (message.proof !== undefined) {
            proof_1.Proof.encode(message.proof, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTxProof();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.rootHash = reader.bytes();
                    break;
                case 2:
                    message.data = reader.bytes();
                    break;
                case 3:
                    message.proof = proof_1.Proof.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseTxProof();
        if ((0, helpers_1.isSet)(object.rootHash)) obj.rootHash = (0, helpers_1.bytesFromBase64)(object.rootHash);
        if ((0, helpers_1.isSet)(object.data)) obj.data = (0, helpers_1.bytesFromBase64)(object.data);
        if ((0, helpers_1.isSet)(object.proof)) obj.proof = proof_1.Proof.fromJSON(object.proof);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.rootHash !== undefined && (obj.rootHash = (0, helpers_1.base64FromBytes)(message.rootHash !== undefined ? message.rootHash : new Uint8Array()));
        message.data !== undefined && (obj.data = (0, helpers_1.base64FromBytes)(message.data !== undefined ? message.data : new Uint8Array()));
        message.proof !== undefined && (obj.proof = message.proof ? proof_1.Proof.toJSON(message.proof) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseTxProof();
        message.rootHash = object.rootHash ?? new Uint8Array();
        message.data = object.data ?? new Uint8Array();
        if (object.proof !== undefined && object.proof !== null) {
            message.proof = proof_1.Proof.fromPartial(object.proof);
        }
        return message;
    }
}; //# sourceMappingURL=types.js.map
}),
"[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/types/params.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HashedParams = exports.VersionParams = exports.ValidatorParams = exports.EvidenceParams = exports.BlockParams = exports.ConsensusParams = exports.protobufPackage = void 0;
/* eslint-disable */ const duration_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/google/protobuf/duration.js [client] (ecmascript)");
const binary_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/binary.js [client] (ecmascript)");
const helpers_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/helpers.js [client] (ecmascript)");
exports.protobufPackage = "tendermint.types";
function createBaseConsensusParams() {
    return {
        block: undefined,
        evidence: undefined,
        validator: undefined,
        version: undefined
    };
}
exports.ConsensusParams = {
    typeUrl: "/tendermint.types.ConsensusParams",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.block !== undefined) {
            exports.BlockParams.encode(message.block, writer.uint32(10).fork()).ldelim();
        }
        if (message.evidence !== undefined) {
            exports.EvidenceParams.encode(message.evidence, writer.uint32(18).fork()).ldelim();
        }
        if (message.validator !== undefined) {
            exports.ValidatorParams.encode(message.validator, writer.uint32(26).fork()).ldelim();
        }
        if (message.version !== undefined) {
            exports.VersionParams.encode(message.version, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseConsensusParams();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.block = exports.BlockParams.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.evidence = exports.EvidenceParams.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.validator = exports.ValidatorParams.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.version = exports.VersionParams.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseConsensusParams();
        if ((0, helpers_1.isSet)(object.block)) obj.block = exports.BlockParams.fromJSON(object.block);
        if ((0, helpers_1.isSet)(object.evidence)) obj.evidence = exports.EvidenceParams.fromJSON(object.evidence);
        if ((0, helpers_1.isSet)(object.validator)) obj.validator = exports.ValidatorParams.fromJSON(object.validator);
        if ((0, helpers_1.isSet)(object.version)) obj.version = exports.VersionParams.fromJSON(object.version);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.block !== undefined && (obj.block = message.block ? exports.BlockParams.toJSON(message.block) : undefined);
        message.evidence !== undefined && (obj.evidence = message.evidence ? exports.EvidenceParams.toJSON(message.evidence) : undefined);
        message.validator !== undefined && (obj.validator = message.validator ? exports.ValidatorParams.toJSON(message.validator) : undefined);
        message.version !== undefined && (obj.version = message.version ? exports.VersionParams.toJSON(message.version) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseConsensusParams();
        if (object.block !== undefined && object.block !== null) {
            message.block = exports.BlockParams.fromPartial(object.block);
        }
        if (object.evidence !== undefined && object.evidence !== null) {
            message.evidence = exports.EvidenceParams.fromPartial(object.evidence);
        }
        if (object.validator !== undefined && object.validator !== null) {
            message.validator = exports.ValidatorParams.fromPartial(object.validator);
        }
        if (object.version !== undefined && object.version !== null) {
            message.version = exports.VersionParams.fromPartial(object.version);
        }
        return message;
    }
};
function createBaseBlockParams() {
    return {
        maxBytes: BigInt(0),
        maxGas: BigInt(0)
    };
}
exports.BlockParams = {
    typeUrl: "/tendermint.types.BlockParams",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.maxBytes !== BigInt(0)) {
            writer.uint32(8).int64(message.maxBytes);
        }
        if (message.maxGas !== BigInt(0)) {
            writer.uint32(16).int64(message.maxGas);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBlockParams();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.maxBytes = reader.int64();
                    break;
                case 2:
                    message.maxGas = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseBlockParams();
        if ((0, helpers_1.isSet)(object.maxBytes)) obj.maxBytes = BigInt(object.maxBytes.toString());
        if ((0, helpers_1.isSet)(object.maxGas)) obj.maxGas = BigInt(object.maxGas.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.maxBytes !== undefined && (obj.maxBytes = (message.maxBytes || BigInt(0)).toString());
        message.maxGas !== undefined && (obj.maxGas = (message.maxGas || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseBlockParams();
        if (object.maxBytes !== undefined && object.maxBytes !== null) {
            message.maxBytes = BigInt(object.maxBytes.toString());
        }
        if (object.maxGas !== undefined && object.maxGas !== null) {
            message.maxGas = BigInt(object.maxGas.toString());
        }
        return message;
    }
};
function createBaseEvidenceParams() {
    return {
        maxAgeNumBlocks: BigInt(0),
        maxAgeDuration: duration_1.Duration.fromPartial({}),
        maxBytes: BigInt(0)
    };
}
exports.EvidenceParams = {
    typeUrl: "/tendermint.types.EvidenceParams",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.maxAgeNumBlocks !== BigInt(0)) {
            writer.uint32(8).int64(message.maxAgeNumBlocks);
        }
        if (message.maxAgeDuration !== undefined) {
            duration_1.Duration.encode(message.maxAgeDuration, writer.uint32(18).fork()).ldelim();
        }
        if (message.maxBytes !== BigInt(0)) {
            writer.uint32(24).int64(message.maxBytes);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEvidenceParams();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.maxAgeNumBlocks = reader.int64();
                    break;
                case 2:
                    message.maxAgeDuration = duration_1.Duration.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.maxBytes = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseEvidenceParams();
        if ((0, helpers_1.isSet)(object.maxAgeNumBlocks)) obj.maxAgeNumBlocks = BigInt(object.maxAgeNumBlocks.toString());
        if ((0, helpers_1.isSet)(object.maxAgeDuration)) obj.maxAgeDuration = duration_1.Duration.fromJSON(object.maxAgeDuration);
        if ((0, helpers_1.isSet)(object.maxBytes)) obj.maxBytes = BigInt(object.maxBytes.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.maxAgeNumBlocks !== undefined && (obj.maxAgeNumBlocks = (message.maxAgeNumBlocks || BigInt(0)).toString());
        message.maxAgeDuration !== undefined && (obj.maxAgeDuration = message.maxAgeDuration ? duration_1.Duration.toJSON(message.maxAgeDuration) : undefined);
        message.maxBytes !== undefined && (obj.maxBytes = (message.maxBytes || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseEvidenceParams();
        if (object.maxAgeNumBlocks !== undefined && object.maxAgeNumBlocks !== null) {
            message.maxAgeNumBlocks = BigInt(object.maxAgeNumBlocks.toString());
        }
        if (object.maxAgeDuration !== undefined && object.maxAgeDuration !== null) {
            message.maxAgeDuration = duration_1.Duration.fromPartial(object.maxAgeDuration);
        }
        if (object.maxBytes !== undefined && object.maxBytes !== null) {
            message.maxBytes = BigInt(object.maxBytes.toString());
        }
        return message;
    }
};
function createBaseValidatorParams() {
    return {
        pubKeyTypes: []
    };
}
exports.ValidatorParams = {
    typeUrl: "/tendermint.types.ValidatorParams",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.pubKeyTypes){
            writer.uint32(10).string(v);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseValidatorParams();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.pubKeyTypes.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseValidatorParams();
        if (Array.isArray(object?.pubKeyTypes)) obj.pubKeyTypes = object.pubKeyTypes.map((e)=>String(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        if (message.pubKeyTypes) {
            obj.pubKeyTypes = message.pubKeyTypes.map((e)=>e);
        } else {
            obj.pubKeyTypes = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseValidatorParams();
        message.pubKeyTypes = object.pubKeyTypes?.map((e)=>e) || [];
        return message;
    }
};
function createBaseVersionParams() {
    return {
        app: BigInt(0)
    };
}
exports.VersionParams = {
    typeUrl: "/tendermint.types.VersionParams",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.app !== BigInt(0)) {
            writer.uint32(8).uint64(message.app);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVersionParams();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.app = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseVersionParams();
        if ((0, helpers_1.isSet)(object.app)) obj.app = BigInt(object.app.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.app !== undefined && (obj.app = (message.app || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseVersionParams();
        if (object.app !== undefined && object.app !== null) {
            message.app = BigInt(object.app.toString());
        }
        return message;
    }
};
function createBaseHashedParams() {
    return {
        blockMaxBytes: BigInt(0),
        blockMaxGas: BigInt(0)
    };
}
exports.HashedParams = {
    typeUrl: "/tendermint.types.HashedParams",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.blockMaxBytes !== BigInt(0)) {
            writer.uint32(8).int64(message.blockMaxBytes);
        }
        if (message.blockMaxGas !== BigInt(0)) {
            writer.uint32(16).int64(message.blockMaxGas);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHashedParams();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.blockMaxBytes = reader.int64();
                    break;
                case 2:
                    message.blockMaxGas = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseHashedParams();
        if ((0, helpers_1.isSet)(object.blockMaxBytes)) obj.blockMaxBytes = BigInt(object.blockMaxBytes.toString());
        if ((0, helpers_1.isSet)(object.blockMaxGas)) obj.blockMaxGas = BigInt(object.blockMaxGas.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.blockMaxBytes !== undefined && (obj.blockMaxBytes = (message.blockMaxBytes || BigInt(0)).toString());
        message.blockMaxGas !== undefined && (obj.blockMaxGas = (message.blockMaxGas || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseHashedParams();
        if (object.blockMaxBytes !== undefined && object.blockMaxBytes !== null) {
            message.blockMaxBytes = BigInt(object.blockMaxBytes.toString());
        }
        if (object.blockMaxGas !== undefined && object.blockMaxGas !== null) {
            message.blockMaxGas = BigInt(object.blockMaxGas.toString());
        }
        return message;
    }
}; //# sourceMappingURL=params.js.map
}),
"[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/abci/types.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ResponsePrepareProposal = exports.ResponseApplySnapshotChunk = exports.ResponseLoadSnapshotChunk = exports.ResponseOfferSnapshot = exports.ResponseListSnapshots = exports.ResponseCommit = exports.ResponseEndBlock = exports.ResponseDeliverTx = exports.ResponseCheckTx = exports.ResponseBeginBlock = exports.ResponseQuery = exports.ResponseInitChain = exports.ResponseInfo = exports.ResponseFlush = exports.ResponseEcho = exports.ResponseException = exports.Response = exports.RequestProcessProposal = exports.RequestPrepareProposal = exports.RequestApplySnapshotChunk = exports.RequestLoadSnapshotChunk = exports.RequestOfferSnapshot = exports.RequestListSnapshots = exports.RequestCommit = exports.RequestEndBlock = exports.RequestDeliverTx = exports.RequestCheckTx = exports.RequestBeginBlock = exports.RequestQuery = exports.RequestInitChain = exports.RequestInfo = exports.RequestFlush = exports.RequestEcho = exports.Request = exports.misbehaviorTypeToJSON = exports.misbehaviorTypeFromJSON = exports.MisbehaviorType = exports.responseProcessProposal_ProposalStatusToJSON = exports.responseProcessProposal_ProposalStatusFromJSON = exports.ResponseProcessProposal_ProposalStatus = exports.responseApplySnapshotChunk_ResultToJSON = exports.responseApplySnapshotChunk_ResultFromJSON = exports.ResponseApplySnapshotChunk_Result = exports.responseOfferSnapshot_ResultToJSON = exports.responseOfferSnapshot_ResultFromJSON = exports.ResponseOfferSnapshot_Result = exports.checkTxTypeToJSON = exports.checkTxTypeFromJSON = exports.CheckTxType = exports.protobufPackage = void 0;
exports.ABCIApplicationClientImpl = exports.Snapshot = exports.Misbehavior = exports.ExtendedVoteInfo = exports.VoteInfo = exports.ValidatorUpdate = exports.Validator = exports.TxResult = exports.EventAttribute = exports.Event = exports.ExtendedCommitInfo = exports.CommitInfo = exports.ResponseProcessProposal = void 0;
/* eslint-disable */ const timestamp_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/google/protobuf/timestamp.js [client] (ecmascript)");
const params_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/types/params.js [client] (ecmascript)");
const types_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/types/types.js [client] (ecmascript)");
const proof_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/crypto/proof.js [client] (ecmascript)");
const keys_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/crypto/keys.js [client] (ecmascript)");
const binary_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/binary.js [client] (ecmascript)");
const helpers_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/helpers.js [client] (ecmascript)");
exports.protobufPackage = "tendermint.abci";
var CheckTxType;
(function(CheckTxType) {
    CheckTxType[CheckTxType["NEW"] = 0] = "NEW";
    CheckTxType[CheckTxType["RECHECK"] = 1] = "RECHECK";
    CheckTxType[CheckTxType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(CheckTxType || (exports.CheckTxType = CheckTxType = {}));
function checkTxTypeFromJSON(object) {
    switch(object){
        case 0:
        case "NEW":
            return CheckTxType.NEW;
        case 1:
        case "RECHECK":
            return CheckTxType.RECHECK;
        case -1:
        case "UNRECOGNIZED":
        default:
            return CheckTxType.UNRECOGNIZED;
    }
}
exports.checkTxTypeFromJSON = checkTxTypeFromJSON;
function checkTxTypeToJSON(object) {
    switch(object){
        case CheckTxType.NEW:
            return "NEW";
        case CheckTxType.RECHECK:
            return "RECHECK";
        case CheckTxType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.checkTxTypeToJSON = checkTxTypeToJSON;
var ResponseOfferSnapshot_Result;
(function(ResponseOfferSnapshot_Result) {
    /** UNKNOWN - Unknown result, abort all snapshot restoration */ ResponseOfferSnapshot_Result[ResponseOfferSnapshot_Result["UNKNOWN"] = 0] = "UNKNOWN";
    /** ACCEPT - Snapshot accepted, apply chunks */ ResponseOfferSnapshot_Result[ResponseOfferSnapshot_Result["ACCEPT"] = 1] = "ACCEPT";
    /** ABORT - Abort all snapshot restoration */ ResponseOfferSnapshot_Result[ResponseOfferSnapshot_Result["ABORT"] = 2] = "ABORT";
    /** REJECT - Reject this specific snapshot, try others */ ResponseOfferSnapshot_Result[ResponseOfferSnapshot_Result["REJECT"] = 3] = "REJECT";
    /** REJECT_FORMAT - Reject all snapshots of this format, try others */ ResponseOfferSnapshot_Result[ResponseOfferSnapshot_Result["REJECT_FORMAT"] = 4] = "REJECT_FORMAT";
    /** REJECT_SENDER - Reject all snapshots from the sender(s), try others */ ResponseOfferSnapshot_Result[ResponseOfferSnapshot_Result["REJECT_SENDER"] = 5] = "REJECT_SENDER";
    ResponseOfferSnapshot_Result[ResponseOfferSnapshot_Result["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ResponseOfferSnapshot_Result || (exports.ResponseOfferSnapshot_Result = ResponseOfferSnapshot_Result = {}));
function responseOfferSnapshot_ResultFromJSON(object) {
    switch(object){
        case 0:
        case "UNKNOWN":
            return ResponseOfferSnapshot_Result.UNKNOWN;
        case 1:
        case "ACCEPT":
            return ResponseOfferSnapshot_Result.ACCEPT;
        case 2:
        case "ABORT":
            return ResponseOfferSnapshot_Result.ABORT;
        case 3:
        case "REJECT":
            return ResponseOfferSnapshot_Result.REJECT;
        case 4:
        case "REJECT_FORMAT":
            return ResponseOfferSnapshot_Result.REJECT_FORMAT;
        case 5:
        case "REJECT_SENDER":
            return ResponseOfferSnapshot_Result.REJECT_SENDER;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ResponseOfferSnapshot_Result.UNRECOGNIZED;
    }
}
exports.responseOfferSnapshot_ResultFromJSON = responseOfferSnapshot_ResultFromJSON;
function responseOfferSnapshot_ResultToJSON(object) {
    switch(object){
        case ResponseOfferSnapshot_Result.UNKNOWN:
            return "UNKNOWN";
        case ResponseOfferSnapshot_Result.ACCEPT:
            return "ACCEPT";
        case ResponseOfferSnapshot_Result.ABORT:
            return "ABORT";
        case ResponseOfferSnapshot_Result.REJECT:
            return "REJECT";
        case ResponseOfferSnapshot_Result.REJECT_FORMAT:
            return "REJECT_FORMAT";
        case ResponseOfferSnapshot_Result.REJECT_SENDER:
            return "REJECT_SENDER";
        case ResponseOfferSnapshot_Result.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.responseOfferSnapshot_ResultToJSON = responseOfferSnapshot_ResultToJSON;
var ResponseApplySnapshotChunk_Result;
(function(ResponseApplySnapshotChunk_Result) {
    /** UNKNOWN - Unknown result, abort all snapshot restoration */ ResponseApplySnapshotChunk_Result[ResponseApplySnapshotChunk_Result["UNKNOWN"] = 0] = "UNKNOWN";
    /** ACCEPT - Chunk successfully accepted */ ResponseApplySnapshotChunk_Result[ResponseApplySnapshotChunk_Result["ACCEPT"] = 1] = "ACCEPT";
    /** ABORT - Abort all snapshot restoration */ ResponseApplySnapshotChunk_Result[ResponseApplySnapshotChunk_Result["ABORT"] = 2] = "ABORT";
    /** RETRY - Retry chunk (combine with refetch and reject) */ ResponseApplySnapshotChunk_Result[ResponseApplySnapshotChunk_Result["RETRY"] = 3] = "RETRY";
    /** RETRY_SNAPSHOT - Retry snapshot (combine with refetch and reject) */ ResponseApplySnapshotChunk_Result[ResponseApplySnapshotChunk_Result["RETRY_SNAPSHOT"] = 4] = "RETRY_SNAPSHOT";
    /** REJECT_SNAPSHOT - Reject this snapshot, try others */ ResponseApplySnapshotChunk_Result[ResponseApplySnapshotChunk_Result["REJECT_SNAPSHOT"] = 5] = "REJECT_SNAPSHOT";
    ResponseApplySnapshotChunk_Result[ResponseApplySnapshotChunk_Result["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ResponseApplySnapshotChunk_Result || (exports.ResponseApplySnapshotChunk_Result = ResponseApplySnapshotChunk_Result = {}));
function responseApplySnapshotChunk_ResultFromJSON(object) {
    switch(object){
        case 0:
        case "UNKNOWN":
            return ResponseApplySnapshotChunk_Result.UNKNOWN;
        case 1:
        case "ACCEPT":
            return ResponseApplySnapshotChunk_Result.ACCEPT;
        case 2:
        case "ABORT":
            return ResponseApplySnapshotChunk_Result.ABORT;
        case 3:
        case "RETRY":
            return ResponseApplySnapshotChunk_Result.RETRY;
        case 4:
        case "RETRY_SNAPSHOT":
            return ResponseApplySnapshotChunk_Result.RETRY_SNAPSHOT;
        case 5:
        case "REJECT_SNAPSHOT":
            return ResponseApplySnapshotChunk_Result.REJECT_SNAPSHOT;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ResponseApplySnapshotChunk_Result.UNRECOGNIZED;
    }
}
exports.responseApplySnapshotChunk_ResultFromJSON = responseApplySnapshotChunk_ResultFromJSON;
function responseApplySnapshotChunk_ResultToJSON(object) {
    switch(object){
        case ResponseApplySnapshotChunk_Result.UNKNOWN:
            return "UNKNOWN";
        case ResponseApplySnapshotChunk_Result.ACCEPT:
            return "ACCEPT";
        case ResponseApplySnapshotChunk_Result.ABORT:
            return "ABORT";
        case ResponseApplySnapshotChunk_Result.RETRY:
            return "RETRY";
        case ResponseApplySnapshotChunk_Result.RETRY_SNAPSHOT:
            return "RETRY_SNAPSHOT";
        case ResponseApplySnapshotChunk_Result.REJECT_SNAPSHOT:
            return "REJECT_SNAPSHOT";
        case ResponseApplySnapshotChunk_Result.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.responseApplySnapshotChunk_ResultToJSON = responseApplySnapshotChunk_ResultToJSON;
var ResponseProcessProposal_ProposalStatus;
(function(ResponseProcessProposal_ProposalStatus) {
    ResponseProcessProposal_ProposalStatus[ResponseProcessProposal_ProposalStatus["UNKNOWN"] = 0] = "UNKNOWN";
    ResponseProcessProposal_ProposalStatus[ResponseProcessProposal_ProposalStatus["ACCEPT"] = 1] = "ACCEPT";
    ResponseProcessProposal_ProposalStatus[ResponseProcessProposal_ProposalStatus["REJECT"] = 2] = "REJECT";
    ResponseProcessProposal_ProposalStatus[ResponseProcessProposal_ProposalStatus["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ResponseProcessProposal_ProposalStatus || (exports.ResponseProcessProposal_ProposalStatus = ResponseProcessProposal_ProposalStatus = {}));
function responseProcessProposal_ProposalStatusFromJSON(object) {
    switch(object){
        case 0:
        case "UNKNOWN":
            return ResponseProcessProposal_ProposalStatus.UNKNOWN;
        case 1:
        case "ACCEPT":
            return ResponseProcessProposal_ProposalStatus.ACCEPT;
        case 2:
        case "REJECT":
            return ResponseProcessProposal_ProposalStatus.REJECT;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ResponseProcessProposal_ProposalStatus.UNRECOGNIZED;
    }
}
exports.responseProcessProposal_ProposalStatusFromJSON = responseProcessProposal_ProposalStatusFromJSON;
function responseProcessProposal_ProposalStatusToJSON(object) {
    switch(object){
        case ResponseProcessProposal_ProposalStatus.UNKNOWN:
            return "UNKNOWN";
        case ResponseProcessProposal_ProposalStatus.ACCEPT:
            return "ACCEPT";
        case ResponseProcessProposal_ProposalStatus.REJECT:
            return "REJECT";
        case ResponseProcessProposal_ProposalStatus.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.responseProcessProposal_ProposalStatusToJSON = responseProcessProposal_ProposalStatusToJSON;
var MisbehaviorType;
(function(MisbehaviorType) {
    MisbehaviorType[MisbehaviorType["UNKNOWN"] = 0] = "UNKNOWN";
    MisbehaviorType[MisbehaviorType["DUPLICATE_VOTE"] = 1] = "DUPLICATE_VOTE";
    MisbehaviorType[MisbehaviorType["LIGHT_CLIENT_ATTACK"] = 2] = "LIGHT_CLIENT_ATTACK";
    MisbehaviorType[MisbehaviorType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(MisbehaviorType || (exports.MisbehaviorType = MisbehaviorType = {}));
function misbehaviorTypeFromJSON(object) {
    switch(object){
        case 0:
        case "UNKNOWN":
            return MisbehaviorType.UNKNOWN;
        case 1:
        case "DUPLICATE_VOTE":
            return MisbehaviorType.DUPLICATE_VOTE;
        case 2:
        case "LIGHT_CLIENT_ATTACK":
            return MisbehaviorType.LIGHT_CLIENT_ATTACK;
        case -1:
        case "UNRECOGNIZED":
        default:
            return MisbehaviorType.UNRECOGNIZED;
    }
}
exports.misbehaviorTypeFromJSON = misbehaviorTypeFromJSON;
function misbehaviorTypeToJSON(object) {
    switch(object){
        case MisbehaviorType.UNKNOWN:
            return "UNKNOWN";
        case MisbehaviorType.DUPLICATE_VOTE:
            return "DUPLICATE_VOTE";
        case MisbehaviorType.LIGHT_CLIENT_ATTACK:
            return "LIGHT_CLIENT_ATTACK";
        case MisbehaviorType.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
exports.misbehaviorTypeToJSON = misbehaviorTypeToJSON;
function createBaseRequest() {
    return {
        echo: undefined,
        flush: undefined,
        info: undefined,
        initChain: undefined,
        query: undefined,
        beginBlock: undefined,
        checkTx: undefined,
        deliverTx: undefined,
        endBlock: undefined,
        commit: undefined,
        listSnapshots: undefined,
        offerSnapshot: undefined,
        loadSnapshotChunk: undefined,
        applySnapshotChunk: undefined,
        prepareProposal: undefined,
        processProposal: undefined
    };
}
exports.Request = {
    typeUrl: "/tendermint.abci.Request",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.echo !== undefined) {
            exports.RequestEcho.encode(message.echo, writer.uint32(10).fork()).ldelim();
        }
        if (message.flush !== undefined) {
            exports.RequestFlush.encode(message.flush, writer.uint32(18).fork()).ldelim();
        }
        if (message.info !== undefined) {
            exports.RequestInfo.encode(message.info, writer.uint32(26).fork()).ldelim();
        }
        if (message.initChain !== undefined) {
            exports.RequestInitChain.encode(message.initChain, writer.uint32(42).fork()).ldelim();
        }
        if (message.query !== undefined) {
            exports.RequestQuery.encode(message.query, writer.uint32(50).fork()).ldelim();
        }
        if (message.beginBlock !== undefined) {
            exports.RequestBeginBlock.encode(message.beginBlock, writer.uint32(58).fork()).ldelim();
        }
        if (message.checkTx !== undefined) {
            exports.RequestCheckTx.encode(message.checkTx, writer.uint32(66).fork()).ldelim();
        }
        if (message.deliverTx !== undefined) {
            exports.RequestDeliverTx.encode(message.deliverTx, writer.uint32(74).fork()).ldelim();
        }
        if (message.endBlock !== undefined) {
            exports.RequestEndBlock.encode(message.endBlock, writer.uint32(82).fork()).ldelim();
        }
        if (message.commit !== undefined) {
            exports.RequestCommit.encode(message.commit, writer.uint32(90).fork()).ldelim();
        }
        if (message.listSnapshots !== undefined) {
            exports.RequestListSnapshots.encode(message.listSnapshots, writer.uint32(98).fork()).ldelim();
        }
        if (message.offerSnapshot !== undefined) {
            exports.RequestOfferSnapshot.encode(message.offerSnapshot, writer.uint32(106).fork()).ldelim();
        }
        if (message.loadSnapshotChunk !== undefined) {
            exports.RequestLoadSnapshotChunk.encode(message.loadSnapshotChunk, writer.uint32(114).fork()).ldelim();
        }
        if (message.applySnapshotChunk !== undefined) {
            exports.RequestApplySnapshotChunk.encode(message.applySnapshotChunk, writer.uint32(122).fork()).ldelim();
        }
        if (message.prepareProposal !== undefined) {
            exports.RequestPrepareProposal.encode(message.prepareProposal, writer.uint32(130).fork()).ldelim();
        }
        if (message.processProposal !== undefined) {
            exports.RequestProcessProposal.encode(message.processProposal, writer.uint32(138).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequest();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.echo = exports.RequestEcho.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.flush = exports.RequestFlush.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.info = exports.RequestInfo.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.initChain = exports.RequestInitChain.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.query = exports.RequestQuery.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.beginBlock = exports.RequestBeginBlock.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.checkTx = exports.RequestCheckTx.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.deliverTx = exports.RequestDeliverTx.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.endBlock = exports.RequestEndBlock.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.commit = exports.RequestCommit.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.listSnapshots = exports.RequestListSnapshots.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.offerSnapshot = exports.RequestOfferSnapshot.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.loadSnapshotChunk = exports.RequestLoadSnapshotChunk.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.applySnapshotChunk = exports.RequestApplySnapshotChunk.decode(reader, reader.uint32());
                    break;
                case 16:
                    message.prepareProposal = exports.RequestPrepareProposal.decode(reader, reader.uint32());
                    break;
                case 17:
                    message.processProposal = exports.RequestProcessProposal.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequest();
        if ((0, helpers_1.isSet)(object.echo)) obj.echo = exports.RequestEcho.fromJSON(object.echo);
        if ((0, helpers_1.isSet)(object.flush)) obj.flush = exports.RequestFlush.fromJSON(object.flush);
        if ((0, helpers_1.isSet)(object.info)) obj.info = exports.RequestInfo.fromJSON(object.info);
        if ((0, helpers_1.isSet)(object.initChain)) obj.initChain = exports.RequestInitChain.fromJSON(object.initChain);
        if ((0, helpers_1.isSet)(object.query)) obj.query = exports.RequestQuery.fromJSON(object.query);
        if ((0, helpers_1.isSet)(object.beginBlock)) obj.beginBlock = exports.RequestBeginBlock.fromJSON(object.beginBlock);
        if ((0, helpers_1.isSet)(object.checkTx)) obj.checkTx = exports.RequestCheckTx.fromJSON(object.checkTx);
        if ((0, helpers_1.isSet)(object.deliverTx)) obj.deliverTx = exports.RequestDeliverTx.fromJSON(object.deliverTx);
        if ((0, helpers_1.isSet)(object.endBlock)) obj.endBlock = exports.RequestEndBlock.fromJSON(object.endBlock);
        if ((0, helpers_1.isSet)(object.commit)) obj.commit = exports.RequestCommit.fromJSON(object.commit);
        if ((0, helpers_1.isSet)(object.listSnapshots)) obj.listSnapshots = exports.RequestListSnapshots.fromJSON(object.listSnapshots);
        if ((0, helpers_1.isSet)(object.offerSnapshot)) obj.offerSnapshot = exports.RequestOfferSnapshot.fromJSON(object.offerSnapshot);
        if ((0, helpers_1.isSet)(object.loadSnapshotChunk)) obj.loadSnapshotChunk = exports.RequestLoadSnapshotChunk.fromJSON(object.loadSnapshotChunk);
        if ((0, helpers_1.isSet)(object.applySnapshotChunk)) obj.applySnapshotChunk = exports.RequestApplySnapshotChunk.fromJSON(object.applySnapshotChunk);
        if ((0, helpers_1.isSet)(object.prepareProposal)) obj.prepareProposal = exports.RequestPrepareProposal.fromJSON(object.prepareProposal);
        if ((0, helpers_1.isSet)(object.processProposal)) obj.processProposal = exports.RequestProcessProposal.fromJSON(object.processProposal);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.echo !== undefined && (obj.echo = message.echo ? exports.RequestEcho.toJSON(message.echo) : undefined);
        message.flush !== undefined && (obj.flush = message.flush ? exports.RequestFlush.toJSON(message.flush) : undefined);
        message.info !== undefined && (obj.info = message.info ? exports.RequestInfo.toJSON(message.info) : undefined);
        message.initChain !== undefined && (obj.initChain = message.initChain ? exports.RequestInitChain.toJSON(message.initChain) : undefined);
        message.query !== undefined && (obj.query = message.query ? exports.RequestQuery.toJSON(message.query) : undefined);
        message.beginBlock !== undefined && (obj.beginBlock = message.beginBlock ? exports.RequestBeginBlock.toJSON(message.beginBlock) : undefined);
        message.checkTx !== undefined && (obj.checkTx = message.checkTx ? exports.RequestCheckTx.toJSON(message.checkTx) : undefined);
        message.deliverTx !== undefined && (obj.deliverTx = message.deliverTx ? exports.RequestDeliverTx.toJSON(message.deliverTx) : undefined);
        message.endBlock !== undefined && (obj.endBlock = message.endBlock ? exports.RequestEndBlock.toJSON(message.endBlock) : undefined);
        message.commit !== undefined && (obj.commit = message.commit ? exports.RequestCommit.toJSON(message.commit) : undefined);
        message.listSnapshots !== undefined && (obj.listSnapshots = message.listSnapshots ? exports.RequestListSnapshots.toJSON(message.listSnapshots) : undefined);
        message.offerSnapshot !== undefined && (obj.offerSnapshot = message.offerSnapshot ? exports.RequestOfferSnapshot.toJSON(message.offerSnapshot) : undefined);
        message.loadSnapshotChunk !== undefined && (obj.loadSnapshotChunk = message.loadSnapshotChunk ? exports.RequestLoadSnapshotChunk.toJSON(message.loadSnapshotChunk) : undefined);
        message.applySnapshotChunk !== undefined && (obj.applySnapshotChunk = message.applySnapshotChunk ? exports.RequestApplySnapshotChunk.toJSON(message.applySnapshotChunk) : undefined);
        message.prepareProposal !== undefined && (obj.prepareProposal = message.prepareProposal ? exports.RequestPrepareProposal.toJSON(message.prepareProposal) : undefined);
        message.processProposal !== undefined && (obj.processProposal = message.processProposal ? exports.RequestProcessProposal.toJSON(message.processProposal) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequest();
        if (object.echo !== undefined && object.echo !== null) {
            message.echo = exports.RequestEcho.fromPartial(object.echo);
        }
        if (object.flush !== undefined && object.flush !== null) {
            message.flush = exports.RequestFlush.fromPartial(object.flush);
        }
        if (object.info !== undefined && object.info !== null) {
            message.info = exports.RequestInfo.fromPartial(object.info);
        }
        if (object.initChain !== undefined && object.initChain !== null) {
            message.initChain = exports.RequestInitChain.fromPartial(object.initChain);
        }
        if (object.query !== undefined && object.query !== null) {
            message.query = exports.RequestQuery.fromPartial(object.query);
        }
        if (object.beginBlock !== undefined && object.beginBlock !== null) {
            message.beginBlock = exports.RequestBeginBlock.fromPartial(object.beginBlock);
        }
        if (object.checkTx !== undefined && object.checkTx !== null) {
            message.checkTx = exports.RequestCheckTx.fromPartial(object.checkTx);
        }
        if (object.deliverTx !== undefined && object.deliverTx !== null) {
            message.deliverTx = exports.RequestDeliverTx.fromPartial(object.deliverTx);
        }
        if (object.endBlock !== undefined && object.endBlock !== null) {
            message.endBlock = exports.RequestEndBlock.fromPartial(object.endBlock);
        }
        if (object.commit !== undefined && object.commit !== null) {
            message.commit = exports.RequestCommit.fromPartial(object.commit);
        }
        if (object.listSnapshots !== undefined && object.listSnapshots !== null) {
            message.listSnapshots = exports.RequestListSnapshots.fromPartial(object.listSnapshots);
        }
        if (object.offerSnapshot !== undefined && object.offerSnapshot !== null) {
            message.offerSnapshot = exports.RequestOfferSnapshot.fromPartial(object.offerSnapshot);
        }
        if (object.loadSnapshotChunk !== undefined && object.loadSnapshotChunk !== null) {
            message.loadSnapshotChunk = exports.RequestLoadSnapshotChunk.fromPartial(object.loadSnapshotChunk);
        }
        if (object.applySnapshotChunk !== undefined && object.applySnapshotChunk !== null) {
            message.applySnapshotChunk = exports.RequestApplySnapshotChunk.fromPartial(object.applySnapshotChunk);
        }
        if (object.prepareProposal !== undefined && object.prepareProposal !== null) {
            message.prepareProposal = exports.RequestPrepareProposal.fromPartial(object.prepareProposal);
        }
        if (object.processProposal !== undefined && object.processProposal !== null) {
            message.processProposal = exports.RequestProcessProposal.fromPartial(object.processProposal);
        }
        return message;
    }
};
function createBaseRequestEcho() {
    return {
        message: ""
    };
}
exports.RequestEcho = {
    typeUrl: "/tendermint.abci.RequestEcho",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.message !== "") {
            writer.uint32(10).string(message.message);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestEcho();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.message = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequestEcho();
        if ((0, helpers_1.isSet)(object.message)) obj.message = String(object.message);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.message !== undefined && (obj.message = message.message);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequestEcho();
        message.message = object.message ?? "";
        return message;
    }
};
function createBaseRequestFlush() {
    return {};
}
exports.RequestFlush = {
    typeUrl: "/tendermint.abci.RequestFlush",
    encode (_, writer = binary_1.BinaryWriter.create()) {
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestFlush();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (_) {
        const obj = createBaseRequestFlush();
        return obj;
    },
    toJSON (_) {
        const obj = {};
        return obj;
    },
    fromPartial (_) {
        const message = createBaseRequestFlush();
        return message;
    }
};
function createBaseRequestInfo() {
    return {
        version: "",
        blockVersion: BigInt(0),
        p2pVersion: BigInt(0),
        abciVersion: ""
    };
}
exports.RequestInfo = {
    typeUrl: "/tendermint.abci.RequestInfo",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.version !== "") {
            writer.uint32(10).string(message.version);
        }
        if (message.blockVersion !== BigInt(0)) {
            writer.uint32(16).uint64(message.blockVersion);
        }
        if (message.p2pVersion !== BigInt(0)) {
            writer.uint32(24).uint64(message.p2pVersion);
        }
        if (message.abciVersion !== "") {
            writer.uint32(34).string(message.abciVersion);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.version = reader.string();
                    break;
                case 2:
                    message.blockVersion = reader.uint64();
                    break;
                case 3:
                    message.p2pVersion = reader.uint64();
                    break;
                case 4:
                    message.abciVersion = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequestInfo();
        if ((0, helpers_1.isSet)(object.version)) obj.version = String(object.version);
        if ((0, helpers_1.isSet)(object.blockVersion)) obj.blockVersion = BigInt(object.blockVersion.toString());
        if ((0, helpers_1.isSet)(object.p2pVersion)) obj.p2pVersion = BigInt(object.p2pVersion.toString());
        if ((0, helpers_1.isSet)(object.abciVersion)) obj.abciVersion = String(object.abciVersion);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.version !== undefined && (obj.version = message.version);
        message.blockVersion !== undefined && (obj.blockVersion = (message.blockVersion || BigInt(0)).toString());
        message.p2pVersion !== undefined && (obj.p2pVersion = (message.p2pVersion || BigInt(0)).toString());
        message.abciVersion !== undefined && (obj.abciVersion = message.abciVersion);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequestInfo();
        message.version = object.version ?? "";
        if (object.blockVersion !== undefined && object.blockVersion !== null) {
            message.blockVersion = BigInt(object.blockVersion.toString());
        }
        if (object.p2pVersion !== undefined && object.p2pVersion !== null) {
            message.p2pVersion = BigInt(object.p2pVersion.toString());
        }
        message.abciVersion = object.abciVersion ?? "";
        return message;
    }
};
function createBaseRequestInitChain() {
    return {
        time: timestamp_1.Timestamp.fromPartial({}),
        chainId: "",
        consensusParams: undefined,
        validators: [],
        appStateBytes: new Uint8Array(),
        initialHeight: BigInt(0)
    };
}
exports.RequestInitChain = {
    typeUrl: "/tendermint.abci.RequestInitChain",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.time !== undefined) {
            timestamp_1.Timestamp.encode(message.time, writer.uint32(10).fork()).ldelim();
        }
        if (message.chainId !== "") {
            writer.uint32(18).string(message.chainId);
        }
        if (message.consensusParams !== undefined) {
            params_1.ConsensusParams.encode(message.consensusParams, writer.uint32(26).fork()).ldelim();
        }
        for (const v of message.validators){
            exports.ValidatorUpdate.encode(v, writer.uint32(34).fork()).ldelim();
        }
        if (message.appStateBytes.length !== 0) {
            writer.uint32(42).bytes(message.appStateBytes);
        }
        if (message.initialHeight !== BigInt(0)) {
            writer.uint32(48).int64(message.initialHeight);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestInitChain();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.time = timestamp_1.Timestamp.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.chainId = reader.string();
                    break;
                case 3:
                    message.consensusParams = params_1.ConsensusParams.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.validators.push(exports.ValidatorUpdate.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.appStateBytes = reader.bytes();
                    break;
                case 6:
                    message.initialHeight = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequestInitChain();
        if ((0, helpers_1.isSet)(object.time)) obj.time = (0, helpers_1.fromJsonTimestamp)(object.time);
        if ((0, helpers_1.isSet)(object.chainId)) obj.chainId = String(object.chainId);
        if ((0, helpers_1.isSet)(object.consensusParams)) obj.consensusParams = params_1.ConsensusParams.fromJSON(object.consensusParams);
        if (Array.isArray(object?.validators)) obj.validators = object.validators.map((e)=>exports.ValidatorUpdate.fromJSON(e));
        if ((0, helpers_1.isSet)(object.appStateBytes)) obj.appStateBytes = (0, helpers_1.bytesFromBase64)(object.appStateBytes);
        if ((0, helpers_1.isSet)(object.initialHeight)) obj.initialHeight = BigInt(object.initialHeight.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.time !== undefined && (obj.time = (0, helpers_1.fromTimestamp)(message.time).toISOString());
        message.chainId !== undefined && (obj.chainId = message.chainId);
        message.consensusParams !== undefined && (obj.consensusParams = message.consensusParams ? params_1.ConsensusParams.toJSON(message.consensusParams) : undefined);
        if (message.validators) {
            obj.validators = message.validators.map((e)=>e ? exports.ValidatorUpdate.toJSON(e) : undefined);
        } else {
            obj.validators = [];
        }
        message.appStateBytes !== undefined && (obj.appStateBytes = (0, helpers_1.base64FromBytes)(message.appStateBytes !== undefined ? message.appStateBytes : new Uint8Array()));
        message.initialHeight !== undefined && (obj.initialHeight = (message.initialHeight || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequestInitChain();
        if (object.time !== undefined && object.time !== null) {
            message.time = timestamp_1.Timestamp.fromPartial(object.time);
        }
        message.chainId = object.chainId ?? "";
        if (object.consensusParams !== undefined && object.consensusParams !== null) {
            message.consensusParams = params_1.ConsensusParams.fromPartial(object.consensusParams);
        }
        message.validators = object.validators?.map((e)=>exports.ValidatorUpdate.fromPartial(e)) || [];
        message.appStateBytes = object.appStateBytes ?? new Uint8Array();
        if (object.initialHeight !== undefined && object.initialHeight !== null) {
            message.initialHeight = BigInt(object.initialHeight.toString());
        }
        return message;
    }
};
function createBaseRequestQuery() {
    return {
        data: new Uint8Array(),
        path: "",
        height: BigInt(0),
        prove: false
    };
}
exports.RequestQuery = {
    typeUrl: "/tendermint.abci.RequestQuery",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.data.length !== 0) {
            writer.uint32(10).bytes(message.data);
        }
        if (message.path !== "") {
            writer.uint32(18).string(message.path);
        }
        if (message.height !== BigInt(0)) {
            writer.uint32(24).int64(message.height);
        }
        if (message.prove === true) {
            writer.uint32(32).bool(message.prove);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestQuery();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.data = reader.bytes();
                    break;
                case 2:
                    message.path = reader.string();
                    break;
                case 3:
                    message.height = reader.int64();
                    break;
                case 4:
                    message.prove = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequestQuery();
        if ((0, helpers_1.isSet)(object.data)) obj.data = (0, helpers_1.bytesFromBase64)(object.data);
        if ((0, helpers_1.isSet)(object.path)) obj.path = String(object.path);
        if ((0, helpers_1.isSet)(object.height)) obj.height = BigInt(object.height.toString());
        if ((0, helpers_1.isSet)(object.prove)) obj.prove = Boolean(object.prove);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.data !== undefined && (obj.data = (0, helpers_1.base64FromBytes)(message.data !== undefined ? message.data : new Uint8Array()));
        message.path !== undefined && (obj.path = message.path);
        message.height !== undefined && (obj.height = (message.height || BigInt(0)).toString());
        message.prove !== undefined && (obj.prove = message.prove);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequestQuery();
        message.data = object.data ?? new Uint8Array();
        message.path = object.path ?? "";
        if (object.height !== undefined && object.height !== null) {
            message.height = BigInt(object.height.toString());
        }
        message.prove = object.prove ?? false;
        return message;
    }
};
function createBaseRequestBeginBlock() {
    return {
        hash: new Uint8Array(),
        header: types_1.Header.fromPartial({}),
        lastCommitInfo: exports.CommitInfo.fromPartial({}),
        byzantineValidators: []
    };
}
exports.RequestBeginBlock = {
    typeUrl: "/tendermint.abci.RequestBeginBlock",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.hash.length !== 0) {
            writer.uint32(10).bytes(message.hash);
        }
        if (message.header !== undefined) {
            types_1.Header.encode(message.header, writer.uint32(18).fork()).ldelim();
        }
        if (message.lastCommitInfo !== undefined) {
            exports.CommitInfo.encode(message.lastCommitInfo, writer.uint32(26).fork()).ldelim();
        }
        for (const v of message.byzantineValidators){
            exports.Misbehavior.encode(v, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestBeginBlock();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.hash = reader.bytes();
                    break;
                case 2:
                    message.header = types_1.Header.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.lastCommitInfo = exports.CommitInfo.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.byzantineValidators.push(exports.Misbehavior.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequestBeginBlock();
        if ((0, helpers_1.isSet)(object.hash)) obj.hash = (0, helpers_1.bytesFromBase64)(object.hash);
        if ((0, helpers_1.isSet)(object.header)) obj.header = types_1.Header.fromJSON(object.header);
        if ((0, helpers_1.isSet)(object.lastCommitInfo)) obj.lastCommitInfo = exports.CommitInfo.fromJSON(object.lastCommitInfo);
        if (Array.isArray(object?.byzantineValidators)) obj.byzantineValidators = object.byzantineValidators.map((e)=>exports.Misbehavior.fromJSON(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.hash !== undefined && (obj.hash = (0, helpers_1.base64FromBytes)(message.hash !== undefined ? message.hash : new Uint8Array()));
        message.header !== undefined && (obj.header = message.header ? types_1.Header.toJSON(message.header) : undefined);
        message.lastCommitInfo !== undefined && (obj.lastCommitInfo = message.lastCommitInfo ? exports.CommitInfo.toJSON(message.lastCommitInfo) : undefined);
        if (message.byzantineValidators) {
            obj.byzantineValidators = message.byzantineValidators.map((e)=>e ? exports.Misbehavior.toJSON(e) : undefined);
        } else {
            obj.byzantineValidators = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequestBeginBlock();
        message.hash = object.hash ?? new Uint8Array();
        if (object.header !== undefined && object.header !== null) {
            message.header = types_1.Header.fromPartial(object.header);
        }
        if (object.lastCommitInfo !== undefined && object.lastCommitInfo !== null) {
            message.lastCommitInfo = exports.CommitInfo.fromPartial(object.lastCommitInfo);
        }
        message.byzantineValidators = object.byzantineValidators?.map((e)=>exports.Misbehavior.fromPartial(e)) || [];
        return message;
    }
};
function createBaseRequestCheckTx() {
    return {
        tx: new Uint8Array(),
        type: 0
    };
}
exports.RequestCheckTx = {
    typeUrl: "/tendermint.abci.RequestCheckTx",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.tx.length !== 0) {
            writer.uint32(10).bytes(message.tx);
        }
        if (message.type !== 0) {
            writer.uint32(16).int32(message.type);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestCheckTx();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.tx = reader.bytes();
                    break;
                case 2:
                    message.type = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequestCheckTx();
        if ((0, helpers_1.isSet)(object.tx)) obj.tx = (0, helpers_1.bytesFromBase64)(object.tx);
        if ((0, helpers_1.isSet)(object.type)) obj.type = checkTxTypeFromJSON(object.type);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.tx !== undefined && (obj.tx = (0, helpers_1.base64FromBytes)(message.tx !== undefined ? message.tx : new Uint8Array()));
        message.type !== undefined && (obj.type = checkTxTypeToJSON(message.type));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequestCheckTx();
        message.tx = object.tx ?? new Uint8Array();
        message.type = object.type ?? 0;
        return message;
    }
};
function createBaseRequestDeliverTx() {
    return {
        tx: new Uint8Array()
    };
}
exports.RequestDeliverTx = {
    typeUrl: "/tendermint.abci.RequestDeliverTx",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.tx.length !== 0) {
            writer.uint32(10).bytes(message.tx);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestDeliverTx();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.tx = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequestDeliverTx();
        if ((0, helpers_1.isSet)(object.tx)) obj.tx = (0, helpers_1.bytesFromBase64)(object.tx);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.tx !== undefined && (obj.tx = (0, helpers_1.base64FromBytes)(message.tx !== undefined ? message.tx : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequestDeliverTx();
        message.tx = object.tx ?? new Uint8Array();
        return message;
    }
};
function createBaseRequestEndBlock() {
    return {
        height: BigInt(0)
    };
}
exports.RequestEndBlock = {
    typeUrl: "/tendermint.abci.RequestEndBlock",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.height !== BigInt(0)) {
            writer.uint32(8).int64(message.height);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestEndBlock();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.height = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequestEndBlock();
        if ((0, helpers_1.isSet)(object.height)) obj.height = BigInt(object.height.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.height !== undefined && (obj.height = (message.height || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequestEndBlock();
        if (object.height !== undefined && object.height !== null) {
            message.height = BigInt(object.height.toString());
        }
        return message;
    }
};
function createBaseRequestCommit() {
    return {};
}
exports.RequestCommit = {
    typeUrl: "/tendermint.abci.RequestCommit",
    encode (_, writer = binary_1.BinaryWriter.create()) {
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestCommit();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (_) {
        const obj = createBaseRequestCommit();
        return obj;
    },
    toJSON (_) {
        const obj = {};
        return obj;
    },
    fromPartial (_) {
        const message = createBaseRequestCommit();
        return message;
    }
};
function createBaseRequestListSnapshots() {
    return {};
}
exports.RequestListSnapshots = {
    typeUrl: "/tendermint.abci.RequestListSnapshots",
    encode (_, writer = binary_1.BinaryWriter.create()) {
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestListSnapshots();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (_) {
        const obj = createBaseRequestListSnapshots();
        return obj;
    },
    toJSON (_) {
        const obj = {};
        return obj;
    },
    fromPartial (_) {
        const message = createBaseRequestListSnapshots();
        return message;
    }
};
function createBaseRequestOfferSnapshot() {
    return {
        snapshot: undefined,
        appHash: new Uint8Array()
    };
}
exports.RequestOfferSnapshot = {
    typeUrl: "/tendermint.abci.RequestOfferSnapshot",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.snapshot !== undefined) {
            exports.Snapshot.encode(message.snapshot, writer.uint32(10).fork()).ldelim();
        }
        if (message.appHash.length !== 0) {
            writer.uint32(18).bytes(message.appHash);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestOfferSnapshot();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.snapshot = exports.Snapshot.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.appHash = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequestOfferSnapshot();
        if ((0, helpers_1.isSet)(object.snapshot)) obj.snapshot = exports.Snapshot.fromJSON(object.snapshot);
        if ((0, helpers_1.isSet)(object.appHash)) obj.appHash = (0, helpers_1.bytesFromBase64)(object.appHash);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.snapshot !== undefined && (obj.snapshot = message.snapshot ? exports.Snapshot.toJSON(message.snapshot) : undefined);
        message.appHash !== undefined && (obj.appHash = (0, helpers_1.base64FromBytes)(message.appHash !== undefined ? message.appHash : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequestOfferSnapshot();
        if (object.snapshot !== undefined && object.snapshot !== null) {
            message.snapshot = exports.Snapshot.fromPartial(object.snapshot);
        }
        message.appHash = object.appHash ?? new Uint8Array();
        return message;
    }
};
function createBaseRequestLoadSnapshotChunk() {
    return {
        height: BigInt(0),
        format: 0,
        chunk: 0
    };
}
exports.RequestLoadSnapshotChunk = {
    typeUrl: "/tendermint.abci.RequestLoadSnapshotChunk",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.height !== BigInt(0)) {
            writer.uint32(8).uint64(message.height);
        }
        if (message.format !== 0) {
            writer.uint32(16).uint32(message.format);
        }
        if (message.chunk !== 0) {
            writer.uint32(24).uint32(message.chunk);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestLoadSnapshotChunk();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.height = reader.uint64();
                    break;
                case 2:
                    message.format = reader.uint32();
                    break;
                case 3:
                    message.chunk = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequestLoadSnapshotChunk();
        if ((0, helpers_1.isSet)(object.height)) obj.height = BigInt(object.height.toString());
        if ((0, helpers_1.isSet)(object.format)) obj.format = Number(object.format);
        if ((0, helpers_1.isSet)(object.chunk)) obj.chunk = Number(object.chunk);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.height !== undefined && (obj.height = (message.height || BigInt(0)).toString());
        message.format !== undefined && (obj.format = Math.round(message.format));
        message.chunk !== undefined && (obj.chunk = Math.round(message.chunk));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequestLoadSnapshotChunk();
        if (object.height !== undefined && object.height !== null) {
            message.height = BigInt(object.height.toString());
        }
        message.format = object.format ?? 0;
        message.chunk = object.chunk ?? 0;
        return message;
    }
};
function createBaseRequestApplySnapshotChunk() {
    return {
        index: 0,
        chunk: new Uint8Array(),
        sender: ""
    };
}
exports.RequestApplySnapshotChunk = {
    typeUrl: "/tendermint.abci.RequestApplySnapshotChunk",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.index !== 0) {
            writer.uint32(8).uint32(message.index);
        }
        if (message.chunk.length !== 0) {
            writer.uint32(18).bytes(message.chunk);
        }
        if (message.sender !== "") {
            writer.uint32(26).string(message.sender);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestApplySnapshotChunk();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.index = reader.uint32();
                    break;
                case 2:
                    message.chunk = reader.bytes();
                    break;
                case 3:
                    message.sender = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequestApplySnapshotChunk();
        if ((0, helpers_1.isSet)(object.index)) obj.index = Number(object.index);
        if ((0, helpers_1.isSet)(object.chunk)) obj.chunk = (0, helpers_1.bytesFromBase64)(object.chunk);
        if ((0, helpers_1.isSet)(object.sender)) obj.sender = String(object.sender);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.index !== undefined && (obj.index = Math.round(message.index));
        message.chunk !== undefined && (obj.chunk = (0, helpers_1.base64FromBytes)(message.chunk !== undefined ? message.chunk : new Uint8Array()));
        message.sender !== undefined && (obj.sender = message.sender);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequestApplySnapshotChunk();
        message.index = object.index ?? 0;
        message.chunk = object.chunk ?? new Uint8Array();
        message.sender = object.sender ?? "";
        return message;
    }
};
function createBaseRequestPrepareProposal() {
    return {
        maxTxBytes: BigInt(0),
        txs: [],
        localLastCommit: exports.ExtendedCommitInfo.fromPartial({}),
        misbehavior: [],
        height: BigInt(0),
        time: timestamp_1.Timestamp.fromPartial({}),
        nextValidatorsHash: new Uint8Array(),
        proposerAddress: new Uint8Array()
    };
}
exports.RequestPrepareProposal = {
    typeUrl: "/tendermint.abci.RequestPrepareProposal",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.maxTxBytes !== BigInt(0)) {
            writer.uint32(8).int64(message.maxTxBytes);
        }
        for (const v of message.txs){
            writer.uint32(18).bytes(v);
        }
        if (message.localLastCommit !== undefined) {
            exports.ExtendedCommitInfo.encode(message.localLastCommit, writer.uint32(26).fork()).ldelim();
        }
        for (const v of message.misbehavior){
            exports.Misbehavior.encode(v, writer.uint32(34).fork()).ldelim();
        }
        if (message.height !== BigInt(0)) {
            writer.uint32(40).int64(message.height);
        }
        if (message.time !== undefined) {
            timestamp_1.Timestamp.encode(message.time, writer.uint32(50).fork()).ldelim();
        }
        if (message.nextValidatorsHash.length !== 0) {
            writer.uint32(58).bytes(message.nextValidatorsHash);
        }
        if (message.proposerAddress.length !== 0) {
            writer.uint32(66).bytes(message.proposerAddress);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestPrepareProposal();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.maxTxBytes = reader.int64();
                    break;
                case 2:
                    message.txs.push(reader.bytes());
                    break;
                case 3:
                    message.localLastCommit = exports.ExtendedCommitInfo.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.misbehavior.push(exports.Misbehavior.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.height = reader.int64();
                    break;
                case 6:
                    message.time = timestamp_1.Timestamp.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.nextValidatorsHash = reader.bytes();
                    break;
                case 8:
                    message.proposerAddress = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequestPrepareProposal();
        if ((0, helpers_1.isSet)(object.maxTxBytes)) obj.maxTxBytes = BigInt(object.maxTxBytes.toString());
        if (Array.isArray(object?.txs)) obj.txs = object.txs.map((e)=>(0, helpers_1.bytesFromBase64)(e));
        if ((0, helpers_1.isSet)(object.localLastCommit)) obj.localLastCommit = exports.ExtendedCommitInfo.fromJSON(object.localLastCommit);
        if (Array.isArray(object?.misbehavior)) obj.misbehavior = object.misbehavior.map((e)=>exports.Misbehavior.fromJSON(e));
        if ((0, helpers_1.isSet)(object.height)) obj.height = BigInt(object.height.toString());
        if ((0, helpers_1.isSet)(object.time)) obj.time = (0, helpers_1.fromJsonTimestamp)(object.time);
        if ((0, helpers_1.isSet)(object.nextValidatorsHash)) obj.nextValidatorsHash = (0, helpers_1.bytesFromBase64)(object.nextValidatorsHash);
        if ((0, helpers_1.isSet)(object.proposerAddress)) obj.proposerAddress = (0, helpers_1.bytesFromBase64)(object.proposerAddress);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.maxTxBytes !== undefined && (obj.maxTxBytes = (message.maxTxBytes || BigInt(0)).toString());
        if (message.txs) {
            obj.txs = message.txs.map((e)=>(0, helpers_1.base64FromBytes)(e !== undefined ? e : new Uint8Array()));
        } else {
            obj.txs = [];
        }
        message.localLastCommit !== undefined && (obj.localLastCommit = message.localLastCommit ? exports.ExtendedCommitInfo.toJSON(message.localLastCommit) : undefined);
        if (message.misbehavior) {
            obj.misbehavior = message.misbehavior.map((e)=>e ? exports.Misbehavior.toJSON(e) : undefined);
        } else {
            obj.misbehavior = [];
        }
        message.height !== undefined && (obj.height = (message.height || BigInt(0)).toString());
        message.time !== undefined && (obj.time = (0, helpers_1.fromTimestamp)(message.time).toISOString());
        message.nextValidatorsHash !== undefined && (obj.nextValidatorsHash = (0, helpers_1.base64FromBytes)(message.nextValidatorsHash !== undefined ? message.nextValidatorsHash : new Uint8Array()));
        message.proposerAddress !== undefined && (obj.proposerAddress = (0, helpers_1.base64FromBytes)(message.proposerAddress !== undefined ? message.proposerAddress : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequestPrepareProposal();
        if (object.maxTxBytes !== undefined && object.maxTxBytes !== null) {
            message.maxTxBytes = BigInt(object.maxTxBytes.toString());
        }
        message.txs = object.txs?.map((e)=>e) || [];
        if (object.localLastCommit !== undefined && object.localLastCommit !== null) {
            message.localLastCommit = exports.ExtendedCommitInfo.fromPartial(object.localLastCommit);
        }
        message.misbehavior = object.misbehavior?.map((e)=>exports.Misbehavior.fromPartial(e)) || [];
        if (object.height !== undefined && object.height !== null) {
            message.height = BigInt(object.height.toString());
        }
        if (object.time !== undefined && object.time !== null) {
            message.time = timestamp_1.Timestamp.fromPartial(object.time);
        }
        message.nextValidatorsHash = object.nextValidatorsHash ?? new Uint8Array();
        message.proposerAddress = object.proposerAddress ?? new Uint8Array();
        return message;
    }
};
function createBaseRequestProcessProposal() {
    return {
        txs: [],
        proposedLastCommit: exports.CommitInfo.fromPartial({}),
        misbehavior: [],
        hash: new Uint8Array(),
        height: BigInt(0),
        time: timestamp_1.Timestamp.fromPartial({}),
        nextValidatorsHash: new Uint8Array(),
        proposerAddress: new Uint8Array()
    };
}
exports.RequestProcessProposal = {
    typeUrl: "/tendermint.abci.RequestProcessProposal",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.txs){
            writer.uint32(10).bytes(v);
        }
        if (message.proposedLastCommit !== undefined) {
            exports.CommitInfo.encode(message.proposedLastCommit, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.misbehavior){
            exports.Misbehavior.encode(v, writer.uint32(26).fork()).ldelim();
        }
        if (message.hash.length !== 0) {
            writer.uint32(34).bytes(message.hash);
        }
        if (message.height !== BigInt(0)) {
            writer.uint32(40).int64(message.height);
        }
        if (message.time !== undefined) {
            timestamp_1.Timestamp.encode(message.time, writer.uint32(50).fork()).ldelim();
        }
        if (message.nextValidatorsHash.length !== 0) {
            writer.uint32(58).bytes(message.nextValidatorsHash);
        }
        if (message.proposerAddress.length !== 0) {
            writer.uint32(66).bytes(message.proposerAddress);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRequestProcessProposal();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.txs.push(reader.bytes());
                    break;
                case 2:
                    message.proposedLastCommit = exports.CommitInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.misbehavior.push(exports.Misbehavior.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.hash = reader.bytes();
                    break;
                case 5:
                    message.height = reader.int64();
                    break;
                case 6:
                    message.time = timestamp_1.Timestamp.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.nextValidatorsHash = reader.bytes();
                    break;
                case 8:
                    message.proposerAddress = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseRequestProcessProposal();
        if (Array.isArray(object?.txs)) obj.txs = object.txs.map((e)=>(0, helpers_1.bytesFromBase64)(e));
        if ((0, helpers_1.isSet)(object.proposedLastCommit)) obj.proposedLastCommit = exports.CommitInfo.fromJSON(object.proposedLastCommit);
        if (Array.isArray(object?.misbehavior)) obj.misbehavior = object.misbehavior.map((e)=>exports.Misbehavior.fromJSON(e));
        if ((0, helpers_1.isSet)(object.hash)) obj.hash = (0, helpers_1.bytesFromBase64)(object.hash);
        if ((0, helpers_1.isSet)(object.height)) obj.height = BigInt(object.height.toString());
        if ((0, helpers_1.isSet)(object.time)) obj.time = (0, helpers_1.fromJsonTimestamp)(object.time);
        if ((0, helpers_1.isSet)(object.nextValidatorsHash)) obj.nextValidatorsHash = (0, helpers_1.bytesFromBase64)(object.nextValidatorsHash);
        if ((0, helpers_1.isSet)(object.proposerAddress)) obj.proposerAddress = (0, helpers_1.bytesFromBase64)(object.proposerAddress);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        if (message.txs) {
            obj.txs = message.txs.map((e)=>(0, helpers_1.base64FromBytes)(e !== undefined ? e : new Uint8Array()));
        } else {
            obj.txs = [];
        }
        message.proposedLastCommit !== undefined && (obj.proposedLastCommit = message.proposedLastCommit ? exports.CommitInfo.toJSON(message.proposedLastCommit) : undefined);
        if (message.misbehavior) {
            obj.misbehavior = message.misbehavior.map((e)=>e ? exports.Misbehavior.toJSON(e) : undefined);
        } else {
            obj.misbehavior = [];
        }
        message.hash !== undefined && (obj.hash = (0, helpers_1.base64FromBytes)(message.hash !== undefined ? message.hash : new Uint8Array()));
        message.height !== undefined && (obj.height = (message.height || BigInt(0)).toString());
        message.time !== undefined && (obj.time = (0, helpers_1.fromTimestamp)(message.time).toISOString());
        message.nextValidatorsHash !== undefined && (obj.nextValidatorsHash = (0, helpers_1.base64FromBytes)(message.nextValidatorsHash !== undefined ? message.nextValidatorsHash : new Uint8Array()));
        message.proposerAddress !== undefined && (obj.proposerAddress = (0, helpers_1.base64FromBytes)(message.proposerAddress !== undefined ? message.proposerAddress : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseRequestProcessProposal();
        message.txs = object.txs?.map((e)=>e) || [];
        if (object.proposedLastCommit !== undefined && object.proposedLastCommit !== null) {
            message.proposedLastCommit = exports.CommitInfo.fromPartial(object.proposedLastCommit);
        }
        message.misbehavior = object.misbehavior?.map((e)=>exports.Misbehavior.fromPartial(e)) || [];
        message.hash = object.hash ?? new Uint8Array();
        if (object.height !== undefined && object.height !== null) {
            message.height = BigInt(object.height.toString());
        }
        if (object.time !== undefined && object.time !== null) {
            message.time = timestamp_1.Timestamp.fromPartial(object.time);
        }
        message.nextValidatorsHash = object.nextValidatorsHash ?? new Uint8Array();
        message.proposerAddress = object.proposerAddress ?? new Uint8Array();
        return message;
    }
};
function createBaseResponse() {
    return {
        exception: undefined,
        echo: undefined,
        flush: undefined,
        info: undefined,
        initChain: undefined,
        query: undefined,
        beginBlock: undefined,
        checkTx: undefined,
        deliverTx: undefined,
        endBlock: undefined,
        commit: undefined,
        listSnapshots: undefined,
        offerSnapshot: undefined,
        loadSnapshotChunk: undefined,
        applySnapshotChunk: undefined,
        prepareProposal: undefined,
        processProposal: undefined
    };
}
exports.Response = {
    typeUrl: "/tendermint.abci.Response",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.exception !== undefined) {
            exports.ResponseException.encode(message.exception, writer.uint32(10).fork()).ldelim();
        }
        if (message.echo !== undefined) {
            exports.ResponseEcho.encode(message.echo, writer.uint32(18).fork()).ldelim();
        }
        if (message.flush !== undefined) {
            exports.ResponseFlush.encode(message.flush, writer.uint32(26).fork()).ldelim();
        }
        if (message.info !== undefined) {
            exports.ResponseInfo.encode(message.info, writer.uint32(34).fork()).ldelim();
        }
        if (message.initChain !== undefined) {
            exports.ResponseInitChain.encode(message.initChain, writer.uint32(50).fork()).ldelim();
        }
        if (message.query !== undefined) {
            exports.ResponseQuery.encode(message.query, writer.uint32(58).fork()).ldelim();
        }
        if (message.beginBlock !== undefined) {
            exports.ResponseBeginBlock.encode(message.beginBlock, writer.uint32(66).fork()).ldelim();
        }
        if (message.checkTx !== undefined) {
            exports.ResponseCheckTx.encode(message.checkTx, writer.uint32(74).fork()).ldelim();
        }
        if (message.deliverTx !== undefined) {
            exports.ResponseDeliverTx.encode(message.deliverTx, writer.uint32(82).fork()).ldelim();
        }
        if (message.endBlock !== undefined) {
            exports.ResponseEndBlock.encode(message.endBlock, writer.uint32(90).fork()).ldelim();
        }
        if (message.commit !== undefined) {
            exports.ResponseCommit.encode(message.commit, writer.uint32(98).fork()).ldelim();
        }
        if (message.listSnapshots !== undefined) {
            exports.ResponseListSnapshots.encode(message.listSnapshots, writer.uint32(106).fork()).ldelim();
        }
        if (message.offerSnapshot !== undefined) {
            exports.ResponseOfferSnapshot.encode(message.offerSnapshot, writer.uint32(114).fork()).ldelim();
        }
        if (message.loadSnapshotChunk !== undefined) {
            exports.ResponseLoadSnapshotChunk.encode(message.loadSnapshotChunk, writer.uint32(122).fork()).ldelim();
        }
        if (message.applySnapshotChunk !== undefined) {
            exports.ResponseApplySnapshotChunk.encode(message.applySnapshotChunk, writer.uint32(130).fork()).ldelim();
        }
        if (message.prepareProposal !== undefined) {
            exports.ResponsePrepareProposal.encode(message.prepareProposal, writer.uint32(138).fork()).ldelim();
        }
        if (message.processProposal !== undefined) {
            exports.ResponseProcessProposal.encode(message.processProposal, writer.uint32(146).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponse();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.exception = exports.ResponseException.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.echo = exports.ResponseEcho.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.flush = exports.ResponseFlush.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.info = exports.ResponseInfo.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.initChain = exports.ResponseInitChain.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.query = exports.ResponseQuery.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.beginBlock = exports.ResponseBeginBlock.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.checkTx = exports.ResponseCheckTx.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.deliverTx = exports.ResponseDeliverTx.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.endBlock = exports.ResponseEndBlock.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.commit = exports.ResponseCommit.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.listSnapshots = exports.ResponseListSnapshots.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.offerSnapshot = exports.ResponseOfferSnapshot.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.loadSnapshotChunk = exports.ResponseLoadSnapshotChunk.decode(reader, reader.uint32());
                    break;
                case 16:
                    message.applySnapshotChunk = exports.ResponseApplySnapshotChunk.decode(reader, reader.uint32());
                    break;
                case 17:
                    message.prepareProposal = exports.ResponsePrepareProposal.decode(reader, reader.uint32());
                    break;
                case 18:
                    message.processProposal = exports.ResponseProcessProposal.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponse();
        if ((0, helpers_1.isSet)(object.exception)) obj.exception = exports.ResponseException.fromJSON(object.exception);
        if ((0, helpers_1.isSet)(object.echo)) obj.echo = exports.ResponseEcho.fromJSON(object.echo);
        if ((0, helpers_1.isSet)(object.flush)) obj.flush = exports.ResponseFlush.fromJSON(object.flush);
        if ((0, helpers_1.isSet)(object.info)) obj.info = exports.ResponseInfo.fromJSON(object.info);
        if ((0, helpers_1.isSet)(object.initChain)) obj.initChain = exports.ResponseInitChain.fromJSON(object.initChain);
        if ((0, helpers_1.isSet)(object.query)) obj.query = exports.ResponseQuery.fromJSON(object.query);
        if ((0, helpers_1.isSet)(object.beginBlock)) obj.beginBlock = exports.ResponseBeginBlock.fromJSON(object.beginBlock);
        if ((0, helpers_1.isSet)(object.checkTx)) obj.checkTx = exports.ResponseCheckTx.fromJSON(object.checkTx);
        if ((0, helpers_1.isSet)(object.deliverTx)) obj.deliverTx = exports.ResponseDeliverTx.fromJSON(object.deliverTx);
        if ((0, helpers_1.isSet)(object.endBlock)) obj.endBlock = exports.ResponseEndBlock.fromJSON(object.endBlock);
        if ((0, helpers_1.isSet)(object.commit)) obj.commit = exports.ResponseCommit.fromJSON(object.commit);
        if ((0, helpers_1.isSet)(object.listSnapshots)) obj.listSnapshots = exports.ResponseListSnapshots.fromJSON(object.listSnapshots);
        if ((0, helpers_1.isSet)(object.offerSnapshot)) obj.offerSnapshot = exports.ResponseOfferSnapshot.fromJSON(object.offerSnapshot);
        if ((0, helpers_1.isSet)(object.loadSnapshotChunk)) obj.loadSnapshotChunk = exports.ResponseLoadSnapshotChunk.fromJSON(object.loadSnapshotChunk);
        if ((0, helpers_1.isSet)(object.applySnapshotChunk)) obj.applySnapshotChunk = exports.ResponseApplySnapshotChunk.fromJSON(object.applySnapshotChunk);
        if ((0, helpers_1.isSet)(object.prepareProposal)) obj.prepareProposal = exports.ResponsePrepareProposal.fromJSON(object.prepareProposal);
        if ((0, helpers_1.isSet)(object.processProposal)) obj.processProposal = exports.ResponseProcessProposal.fromJSON(object.processProposal);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.exception !== undefined && (obj.exception = message.exception ? exports.ResponseException.toJSON(message.exception) : undefined);
        message.echo !== undefined && (obj.echo = message.echo ? exports.ResponseEcho.toJSON(message.echo) : undefined);
        message.flush !== undefined && (obj.flush = message.flush ? exports.ResponseFlush.toJSON(message.flush) : undefined);
        message.info !== undefined && (obj.info = message.info ? exports.ResponseInfo.toJSON(message.info) : undefined);
        message.initChain !== undefined && (obj.initChain = message.initChain ? exports.ResponseInitChain.toJSON(message.initChain) : undefined);
        message.query !== undefined && (obj.query = message.query ? exports.ResponseQuery.toJSON(message.query) : undefined);
        message.beginBlock !== undefined && (obj.beginBlock = message.beginBlock ? exports.ResponseBeginBlock.toJSON(message.beginBlock) : undefined);
        message.checkTx !== undefined && (obj.checkTx = message.checkTx ? exports.ResponseCheckTx.toJSON(message.checkTx) : undefined);
        message.deliverTx !== undefined && (obj.deliverTx = message.deliverTx ? exports.ResponseDeliverTx.toJSON(message.deliverTx) : undefined);
        message.endBlock !== undefined && (obj.endBlock = message.endBlock ? exports.ResponseEndBlock.toJSON(message.endBlock) : undefined);
        message.commit !== undefined && (obj.commit = message.commit ? exports.ResponseCommit.toJSON(message.commit) : undefined);
        message.listSnapshots !== undefined && (obj.listSnapshots = message.listSnapshots ? exports.ResponseListSnapshots.toJSON(message.listSnapshots) : undefined);
        message.offerSnapshot !== undefined && (obj.offerSnapshot = message.offerSnapshot ? exports.ResponseOfferSnapshot.toJSON(message.offerSnapshot) : undefined);
        message.loadSnapshotChunk !== undefined && (obj.loadSnapshotChunk = message.loadSnapshotChunk ? exports.ResponseLoadSnapshotChunk.toJSON(message.loadSnapshotChunk) : undefined);
        message.applySnapshotChunk !== undefined && (obj.applySnapshotChunk = message.applySnapshotChunk ? exports.ResponseApplySnapshotChunk.toJSON(message.applySnapshotChunk) : undefined);
        message.prepareProposal !== undefined && (obj.prepareProposal = message.prepareProposal ? exports.ResponsePrepareProposal.toJSON(message.prepareProposal) : undefined);
        message.processProposal !== undefined && (obj.processProposal = message.processProposal ? exports.ResponseProcessProposal.toJSON(message.processProposal) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponse();
        if (object.exception !== undefined && object.exception !== null) {
            message.exception = exports.ResponseException.fromPartial(object.exception);
        }
        if (object.echo !== undefined && object.echo !== null) {
            message.echo = exports.ResponseEcho.fromPartial(object.echo);
        }
        if (object.flush !== undefined && object.flush !== null) {
            message.flush = exports.ResponseFlush.fromPartial(object.flush);
        }
        if (object.info !== undefined && object.info !== null) {
            message.info = exports.ResponseInfo.fromPartial(object.info);
        }
        if (object.initChain !== undefined && object.initChain !== null) {
            message.initChain = exports.ResponseInitChain.fromPartial(object.initChain);
        }
        if (object.query !== undefined && object.query !== null) {
            message.query = exports.ResponseQuery.fromPartial(object.query);
        }
        if (object.beginBlock !== undefined && object.beginBlock !== null) {
            message.beginBlock = exports.ResponseBeginBlock.fromPartial(object.beginBlock);
        }
        if (object.checkTx !== undefined && object.checkTx !== null) {
            message.checkTx = exports.ResponseCheckTx.fromPartial(object.checkTx);
        }
        if (object.deliverTx !== undefined && object.deliverTx !== null) {
            message.deliverTx = exports.ResponseDeliverTx.fromPartial(object.deliverTx);
        }
        if (object.endBlock !== undefined && object.endBlock !== null) {
            message.endBlock = exports.ResponseEndBlock.fromPartial(object.endBlock);
        }
        if (object.commit !== undefined && object.commit !== null) {
            message.commit = exports.ResponseCommit.fromPartial(object.commit);
        }
        if (object.listSnapshots !== undefined && object.listSnapshots !== null) {
            message.listSnapshots = exports.ResponseListSnapshots.fromPartial(object.listSnapshots);
        }
        if (object.offerSnapshot !== undefined && object.offerSnapshot !== null) {
            message.offerSnapshot = exports.ResponseOfferSnapshot.fromPartial(object.offerSnapshot);
        }
        if (object.loadSnapshotChunk !== undefined && object.loadSnapshotChunk !== null) {
            message.loadSnapshotChunk = exports.ResponseLoadSnapshotChunk.fromPartial(object.loadSnapshotChunk);
        }
        if (object.applySnapshotChunk !== undefined && object.applySnapshotChunk !== null) {
            message.applySnapshotChunk = exports.ResponseApplySnapshotChunk.fromPartial(object.applySnapshotChunk);
        }
        if (object.prepareProposal !== undefined && object.prepareProposal !== null) {
            message.prepareProposal = exports.ResponsePrepareProposal.fromPartial(object.prepareProposal);
        }
        if (object.processProposal !== undefined && object.processProposal !== null) {
            message.processProposal = exports.ResponseProcessProposal.fromPartial(object.processProposal);
        }
        return message;
    }
};
function createBaseResponseException() {
    return {
        error: ""
    };
}
exports.ResponseException = {
    typeUrl: "/tendermint.abci.ResponseException",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.error !== "") {
            writer.uint32(10).string(message.error);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseException();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.error = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseException();
        if ((0, helpers_1.isSet)(object.error)) obj.error = String(object.error);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.error !== undefined && (obj.error = message.error);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseException();
        message.error = object.error ?? "";
        return message;
    }
};
function createBaseResponseEcho() {
    return {
        message: ""
    };
}
exports.ResponseEcho = {
    typeUrl: "/tendermint.abci.ResponseEcho",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.message !== "") {
            writer.uint32(10).string(message.message);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseEcho();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.message = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseEcho();
        if ((0, helpers_1.isSet)(object.message)) obj.message = String(object.message);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.message !== undefined && (obj.message = message.message);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseEcho();
        message.message = object.message ?? "";
        return message;
    }
};
function createBaseResponseFlush() {
    return {};
}
exports.ResponseFlush = {
    typeUrl: "/tendermint.abci.ResponseFlush",
    encode (_, writer = binary_1.BinaryWriter.create()) {
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseFlush();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (_) {
        const obj = createBaseResponseFlush();
        return obj;
    },
    toJSON (_) {
        const obj = {};
        return obj;
    },
    fromPartial (_) {
        const message = createBaseResponseFlush();
        return message;
    }
};
function createBaseResponseInfo() {
    return {
        data: "",
        version: "",
        appVersion: BigInt(0),
        lastBlockHeight: BigInt(0),
        lastBlockAppHash: new Uint8Array()
    };
}
exports.ResponseInfo = {
    typeUrl: "/tendermint.abci.ResponseInfo",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.data !== "") {
            writer.uint32(10).string(message.data);
        }
        if (message.version !== "") {
            writer.uint32(18).string(message.version);
        }
        if (message.appVersion !== BigInt(0)) {
            writer.uint32(24).uint64(message.appVersion);
        }
        if (message.lastBlockHeight !== BigInt(0)) {
            writer.uint32(32).int64(message.lastBlockHeight);
        }
        if (message.lastBlockAppHash.length !== 0) {
            writer.uint32(42).bytes(message.lastBlockAppHash);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.data = reader.string();
                    break;
                case 2:
                    message.version = reader.string();
                    break;
                case 3:
                    message.appVersion = reader.uint64();
                    break;
                case 4:
                    message.lastBlockHeight = reader.int64();
                    break;
                case 5:
                    message.lastBlockAppHash = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseInfo();
        if ((0, helpers_1.isSet)(object.data)) obj.data = String(object.data);
        if ((0, helpers_1.isSet)(object.version)) obj.version = String(object.version);
        if ((0, helpers_1.isSet)(object.appVersion)) obj.appVersion = BigInt(object.appVersion.toString());
        if ((0, helpers_1.isSet)(object.lastBlockHeight)) obj.lastBlockHeight = BigInt(object.lastBlockHeight.toString());
        if ((0, helpers_1.isSet)(object.lastBlockAppHash)) obj.lastBlockAppHash = (0, helpers_1.bytesFromBase64)(object.lastBlockAppHash);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.data !== undefined && (obj.data = message.data);
        message.version !== undefined && (obj.version = message.version);
        message.appVersion !== undefined && (obj.appVersion = (message.appVersion || BigInt(0)).toString());
        message.lastBlockHeight !== undefined && (obj.lastBlockHeight = (message.lastBlockHeight || BigInt(0)).toString());
        message.lastBlockAppHash !== undefined && (obj.lastBlockAppHash = (0, helpers_1.base64FromBytes)(message.lastBlockAppHash !== undefined ? message.lastBlockAppHash : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseInfo();
        message.data = object.data ?? "";
        message.version = object.version ?? "";
        if (object.appVersion !== undefined && object.appVersion !== null) {
            message.appVersion = BigInt(object.appVersion.toString());
        }
        if (object.lastBlockHeight !== undefined && object.lastBlockHeight !== null) {
            message.lastBlockHeight = BigInt(object.lastBlockHeight.toString());
        }
        message.lastBlockAppHash = object.lastBlockAppHash ?? new Uint8Array();
        return message;
    }
};
function createBaseResponseInitChain() {
    return {
        consensusParams: undefined,
        validators: [],
        appHash: new Uint8Array()
    };
}
exports.ResponseInitChain = {
    typeUrl: "/tendermint.abci.ResponseInitChain",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.consensusParams !== undefined) {
            params_1.ConsensusParams.encode(message.consensusParams, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.validators){
            exports.ValidatorUpdate.encode(v, writer.uint32(18).fork()).ldelim();
        }
        if (message.appHash.length !== 0) {
            writer.uint32(26).bytes(message.appHash);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseInitChain();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.consensusParams = params_1.ConsensusParams.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.validators.push(exports.ValidatorUpdate.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.appHash = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseInitChain();
        if ((0, helpers_1.isSet)(object.consensusParams)) obj.consensusParams = params_1.ConsensusParams.fromJSON(object.consensusParams);
        if (Array.isArray(object?.validators)) obj.validators = object.validators.map((e)=>exports.ValidatorUpdate.fromJSON(e));
        if ((0, helpers_1.isSet)(object.appHash)) obj.appHash = (0, helpers_1.bytesFromBase64)(object.appHash);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.consensusParams !== undefined && (obj.consensusParams = message.consensusParams ? params_1.ConsensusParams.toJSON(message.consensusParams) : undefined);
        if (message.validators) {
            obj.validators = message.validators.map((e)=>e ? exports.ValidatorUpdate.toJSON(e) : undefined);
        } else {
            obj.validators = [];
        }
        message.appHash !== undefined && (obj.appHash = (0, helpers_1.base64FromBytes)(message.appHash !== undefined ? message.appHash : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseInitChain();
        if (object.consensusParams !== undefined && object.consensusParams !== null) {
            message.consensusParams = params_1.ConsensusParams.fromPartial(object.consensusParams);
        }
        message.validators = object.validators?.map((e)=>exports.ValidatorUpdate.fromPartial(e)) || [];
        message.appHash = object.appHash ?? new Uint8Array();
        return message;
    }
};
function createBaseResponseQuery() {
    return {
        code: 0,
        log: "",
        info: "",
        index: BigInt(0),
        key: new Uint8Array(),
        value: new Uint8Array(),
        proofOps: undefined,
        height: BigInt(0),
        codespace: ""
    };
}
exports.ResponseQuery = {
    typeUrl: "/tendermint.abci.ResponseQuery",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.code !== 0) {
            writer.uint32(8).uint32(message.code);
        }
        if (message.log !== "") {
            writer.uint32(26).string(message.log);
        }
        if (message.info !== "") {
            writer.uint32(34).string(message.info);
        }
        if (message.index !== BigInt(0)) {
            writer.uint32(40).int64(message.index);
        }
        if (message.key.length !== 0) {
            writer.uint32(50).bytes(message.key);
        }
        if (message.value.length !== 0) {
            writer.uint32(58).bytes(message.value);
        }
        if (message.proofOps !== undefined) {
            proof_1.ProofOps.encode(message.proofOps, writer.uint32(66).fork()).ldelim();
        }
        if (message.height !== BigInt(0)) {
            writer.uint32(72).int64(message.height);
        }
        if (message.codespace !== "") {
            writer.uint32(82).string(message.codespace);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseQuery();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.code = reader.uint32();
                    break;
                case 3:
                    message.log = reader.string();
                    break;
                case 4:
                    message.info = reader.string();
                    break;
                case 5:
                    message.index = reader.int64();
                    break;
                case 6:
                    message.key = reader.bytes();
                    break;
                case 7:
                    message.value = reader.bytes();
                    break;
                case 8:
                    message.proofOps = proof_1.ProofOps.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.height = reader.int64();
                    break;
                case 10:
                    message.codespace = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseQuery();
        if ((0, helpers_1.isSet)(object.code)) obj.code = Number(object.code);
        if ((0, helpers_1.isSet)(object.log)) obj.log = String(object.log);
        if ((0, helpers_1.isSet)(object.info)) obj.info = String(object.info);
        if ((0, helpers_1.isSet)(object.index)) obj.index = BigInt(object.index.toString());
        if ((0, helpers_1.isSet)(object.key)) obj.key = (0, helpers_1.bytesFromBase64)(object.key);
        if ((0, helpers_1.isSet)(object.value)) obj.value = (0, helpers_1.bytesFromBase64)(object.value);
        if ((0, helpers_1.isSet)(object.proofOps)) obj.proofOps = proof_1.ProofOps.fromJSON(object.proofOps);
        if ((0, helpers_1.isSet)(object.height)) obj.height = BigInt(object.height.toString());
        if ((0, helpers_1.isSet)(object.codespace)) obj.codespace = String(object.codespace);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.code !== undefined && (obj.code = Math.round(message.code));
        message.log !== undefined && (obj.log = message.log);
        message.info !== undefined && (obj.info = message.info);
        message.index !== undefined && (obj.index = (message.index || BigInt(0)).toString());
        message.key !== undefined && (obj.key = (0, helpers_1.base64FromBytes)(message.key !== undefined ? message.key : new Uint8Array()));
        message.value !== undefined && (obj.value = (0, helpers_1.base64FromBytes)(message.value !== undefined ? message.value : new Uint8Array()));
        message.proofOps !== undefined && (obj.proofOps = message.proofOps ? proof_1.ProofOps.toJSON(message.proofOps) : undefined);
        message.height !== undefined && (obj.height = (message.height || BigInt(0)).toString());
        message.codespace !== undefined && (obj.codespace = message.codespace);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseQuery();
        message.code = object.code ?? 0;
        message.log = object.log ?? "";
        message.info = object.info ?? "";
        if (object.index !== undefined && object.index !== null) {
            message.index = BigInt(object.index.toString());
        }
        message.key = object.key ?? new Uint8Array();
        message.value = object.value ?? new Uint8Array();
        if (object.proofOps !== undefined && object.proofOps !== null) {
            message.proofOps = proof_1.ProofOps.fromPartial(object.proofOps);
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = BigInt(object.height.toString());
        }
        message.codespace = object.codespace ?? "";
        return message;
    }
};
function createBaseResponseBeginBlock() {
    return {
        events: []
    };
}
exports.ResponseBeginBlock = {
    typeUrl: "/tendermint.abci.ResponseBeginBlock",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.events){
            exports.Event.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseBeginBlock();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.events.push(exports.Event.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseBeginBlock();
        if (Array.isArray(object?.events)) obj.events = object.events.map((e)=>exports.Event.fromJSON(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        if (message.events) {
            obj.events = message.events.map((e)=>e ? exports.Event.toJSON(e) : undefined);
        } else {
            obj.events = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseBeginBlock();
        message.events = object.events?.map((e)=>exports.Event.fromPartial(e)) || [];
        return message;
    }
};
function createBaseResponseCheckTx() {
    return {
        code: 0,
        data: new Uint8Array(),
        log: "",
        info: "",
        gasWanted: BigInt(0),
        gasUsed: BigInt(0),
        events: [],
        codespace: "",
        sender: "",
        priority: BigInt(0),
        mempoolError: ""
    };
}
exports.ResponseCheckTx = {
    typeUrl: "/tendermint.abci.ResponseCheckTx",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.code !== 0) {
            writer.uint32(8).uint32(message.code);
        }
        if (message.data.length !== 0) {
            writer.uint32(18).bytes(message.data);
        }
        if (message.log !== "") {
            writer.uint32(26).string(message.log);
        }
        if (message.info !== "") {
            writer.uint32(34).string(message.info);
        }
        if (message.gasWanted !== BigInt(0)) {
            writer.uint32(40).int64(message.gasWanted);
        }
        if (message.gasUsed !== BigInt(0)) {
            writer.uint32(48).int64(message.gasUsed);
        }
        for (const v of message.events){
            exports.Event.encode(v, writer.uint32(58).fork()).ldelim();
        }
        if (message.codespace !== "") {
            writer.uint32(66).string(message.codespace);
        }
        if (message.sender !== "") {
            writer.uint32(74).string(message.sender);
        }
        if (message.priority !== BigInt(0)) {
            writer.uint32(80).int64(message.priority);
        }
        if (message.mempoolError !== "") {
            writer.uint32(90).string(message.mempoolError);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseCheckTx();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.code = reader.uint32();
                    break;
                case 2:
                    message.data = reader.bytes();
                    break;
                case 3:
                    message.log = reader.string();
                    break;
                case 4:
                    message.info = reader.string();
                    break;
                case 5:
                    message.gasWanted = reader.int64();
                    break;
                case 6:
                    message.gasUsed = reader.int64();
                    break;
                case 7:
                    message.events.push(exports.Event.decode(reader, reader.uint32()));
                    break;
                case 8:
                    message.codespace = reader.string();
                    break;
                case 9:
                    message.sender = reader.string();
                    break;
                case 10:
                    message.priority = reader.int64();
                    break;
                case 11:
                    message.mempoolError = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseCheckTx();
        if ((0, helpers_1.isSet)(object.code)) obj.code = Number(object.code);
        if ((0, helpers_1.isSet)(object.data)) obj.data = (0, helpers_1.bytesFromBase64)(object.data);
        if ((0, helpers_1.isSet)(object.log)) obj.log = String(object.log);
        if ((0, helpers_1.isSet)(object.info)) obj.info = String(object.info);
        if ((0, helpers_1.isSet)(object.gas_wanted)) obj.gasWanted = BigInt(object.gas_wanted.toString());
        if ((0, helpers_1.isSet)(object.gas_used)) obj.gasUsed = BigInt(object.gas_used.toString());
        if (Array.isArray(object?.events)) obj.events = object.events.map((e)=>exports.Event.fromJSON(e));
        if ((0, helpers_1.isSet)(object.codespace)) obj.codespace = String(object.codespace);
        if ((0, helpers_1.isSet)(object.sender)) obj.sender = String(object.sender);
        if ((0, helpers_1.isSet)(object.priority)) obj.priority = BigInt(object.priority.toString());
        if ((0, helpers_1.isSet)(object.mempoolError)) obj.mempoolError = String(object.mempoolError);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.code !== undefined && (obj.code = Math.round(message.code));
        message.data !== undefined && (obj.data = (0, helpers_1.base64FromBytes)(message.data !== undefined ? message.data : new Uint8Array()));
        message.log !== undefined && (obj.log = message.log);
        message.info !== undefined && (obj.info = message.info);
        message.gasWanted !== undefined && (obj.gas_wanted = (message.gasWanted || BigInt(0)).toString());
        message.gasUsed !== undefined && (obj.gas_used = (message.gasUsed || BigInt(0)).toString());
        if (message.events) {
            obj.events = message.events.map((e)=>e ? exports.Event.toJSON(e) : undefined);
        } else {
            obj.events = [];
        }
        message.codespace !== undefined && (obj.codespace = message.codespace);
        message.sender !== undefined && (obj.sender = message.sender);
        message.priority !== undefined && (obj.priority = (message.priority || BigInt(0)).toString());
        message.mempoolError !== undefined && (obj.mempoolError = message.mempoolError);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseCheckTx();
        message.code = object.code ?? 0;
        message.data = object.data ?? new Uint8Array();
        message.log = object.log ?? "";
        message.info = object.info ?? "";
        if (object.gasWanted !== undefined && object.gasWanted !== null) {
            message.gasWanted = BigInt(object.gasWanted.toString());
        }
        if (object.gasUsed !== undefined && object.gasUsed !== null) {
            message.gasUsed = BigInt(object.gasUsed.toString());
        }
        message.events = object.events?.map((e)=>exports.Event.fromPartial(e)) || [];
        message.codespace = object.codespace ?? "";
        message.sender = object.sender ?? "";
        if (object.priority !== undefined && object.priority !== null) {
            message.priority = BigInt(object.priority.toString());
        }
        message.mempoolError = object.mempoolError ?? "";
        return message;
    }
};
function createBaseResponseDeliverTx() {
    return {
        code: 0,
        data: new Uint8Array(),
        log: "",
        info: "",
        gasWanted: BigInt(0),
        gasUsed: BigInt(0),
        events: [],
        codespace: ""
    };
}
exports.ResponseDeliverTx = {
    typeUrl: "/tendermint.abci.ResponseDeliverTx",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.code !== 0) {
            writer.uint32(8).uint32(message.code);
        }
        if (message.data.length !== 0) {
            writer.uint32(18).bytes(message.data);
        }
        if (message.log !== "") {
            writer.uint32(26).string(message.log);
        }
        if (message.info !== "") {
            writer.uint32(34).string(message.info);
        }
        if (message.gasWanted !== BigInt(0)) {
            writer.uint32(40).int64(message.gasWanted);
        }
        if (message.gasUsed !== BigInt(0)) {
            writer.uint32(48).int64(message.gasUsed);
        }
        for (const v of message.events){
            exports.Event.encode(v, writer.uint32(58).fork()).ldelim();
        }
        if (message.codespace !== "") {
            writer.uint32(66).string(message.codespace);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseDeliverTx();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.code = reader.uint32();
                    break;
                case 2:
                    message.data = reader.bytes();
                    break;
                case 3:
                    message.log = reader.string();
                    break;
                case 4:
                    message.info = reader.string();
                    break;
                case 5:
                    message.gasWanted = reader.int64();
                    break;
                case 6:
                    message.gasUsed = reader.int64();
                    break;
                case 7:
                    message.events.push(exports.Event.decode(reader, reader.uint32()));
                    break;
                case 8:
                    message.codespace = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseDeliverTx();
        if ((0, helpers_1.isSet)(object.code)) obj.code = Number(object.code);
        if ((0, helpers_1.isSet)(object.data)) obj.data = (0, helpers_1.bytesFromBase64)(object.data);
        if ((0, helpers_1.isSet)(object.log)) obj.log = String(object.log);
        if ((0, helpers_1.isSet)(object.info)) obj.info = String(object.info);
        if ((0, helpers_1.isSet)(object.gas_wanted)) obj.gasWanted = BigInt(object.gas_wanted.toString());
        if ((0, helpers_1.isSet)(object.gas_used)) obj.gasUsed = BigInt(object.gas_used.toString());
        if (Array.isArray(object?.events)) obj.events = object.events.map((e)=>exports.Event.fromJSON(e));
        if ((0, helpers_1.isSet)(object.codespace)) obj.codespace = String(object.codespace);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.code !== undefined && (obj.code = Math.round(message.code));
        message.data !== undefined && (obj.data = (0, helpers_1.base64FromBytes)(message.data !== undefined ? message.data : new Uint8Array()));
        message.log !== undefined && (obj.log = message.log);
        message.info !== undefined && (obj.info = message.info);
        message.gasWanted !== undefined && (obj.gas_wanted = (message.gasWanted || BigInt(0)).toString());
        message.gasUsed !== undefined && (obj.gas_used = (message.gasUsed || BigInt(0)).toString());
        if (message.events) {
            obj.events = message.events.map((e)=>e ? exports.Event.toJSON(e) : undefined);
        } else {
            obj.events = [];
        }
        message.codespace !== undefined && (obj.codespace = message.codespace);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseDeliverTx();
        message.code = object.code ?? 0;
        message.data = object.data ?? new Uint8Array();
        message.log = object.log ?? "";
        message.info = object.info ?? "";
        if (object.gasWanted !== undefined && object.gasWanted !== null) {
            message.gasWanted = BigInt(object.gasWanted.toString());
        }
        if (object.gasUsed !== undefined && object.gasUsed !== null) {
            message.gasUsed = BigInt(object.gasUsed.toString());
        }
        message.events = object.events?.map((e)=>exports.Event.fromPartial(e)) || [];
        message.codespace = object.codespace ?? "";
        return message;
    }
};
function createBaseResponseEndBlock() {
    return {
        validatorUpdates: [],
        consensusParamUpdates: undefined,
        events: []
    };
}
exports.ResponseEndBlock = {
    typeUrl: "/tendermint.abci.ResponseEndBlock",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.validatorUpdates){
            exports.ValidatorUpdate.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.consensusParamUpdates !== undefined) {
            params_1.ConsensusParams.encode(message.consensusParamUpdates, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.events){
            exports.Event.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseEndBlock();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.validatorUpdates.push(exports.ValidatorUpdate.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.consensusParamUpdates = params_1.ConsensusParams.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.events.push(exports.Event.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseEndBlock();
        if (Array.isArray(object?.validatorUpdates)) obj.validatorUpdates = object.validatorUpdates.map((e)=>exports.ValidatorUpdate.fromJSON(e));
        if ((0, helpers_1.isSet)(object.consensusParamUpdates)) obj.consensusParamUpdates = params_1.ConsensusParams.fromJSON(object.consensusParamUpdates);
        if (Array.isArray(object?.events)) obj.events = object.events.map((e)=>exports.Event.fromJSON(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        if (message.validatorUpdates) {
            obj.validatorUpdates = message.validatorUpdates.map((e)=>e ? exports.ValidatorUpdate.toJSON(e) : undefined);
        } else {
            obj.validatorUpdates = [];
        }
        message.consensusParamUpdates !== undefined && (obj.consensusParamUpdates = message.consensusParamUpdates ? params_1.ConsensusParams.toJSON(message.consensusParamUpdates) : undefined);
        if (message.events) {
            obj.events = message.events.map((e)=>e ? exports.Event.toJSON(e) : undefined);
        } else {
            obj.events = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseEndBlock();
        message.validatorUpdates = object.validatorUpdates?.map((e)=>exports.ValidatorUpdate.fromPartial(e)) || [];
        if (object.consensusParamUpdates !== undefined && object.consensusParamUpdates !== null) {
            message.consensusParamUpdates = params_1.ConsensusParams.fromPartial(object.consensusParamUpdates);
        }
        message.events = object.events?.map((e)=>exports.Event.fromPartial(e)) || [];
        return message;
    }
};
function createBaseResponseCommit() {
    return {
        data: new Uint8Array(),
        retainHeight: BigInt(0)
    };
}
exports.ResponseCommit = {
    typeUrl: "/tendermint.abci.ResponseCommit",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.data.length !== 0) {
            writer.uint32(18).bytes(message.data);
        }
        if (message.retainHeight !== BigInt(0)) {
            writer.uint32(24).int64(message.retainHeight);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseCommit();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 2:
                    message.data = reader.bytes();
                    break;
                case 3:
                    message.retainHeight = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseCommit();
        if ((0, helpers_1.isSet)(object.data)) obj.data = (0, helpers_1.bytesFromBase64)(object.data);
        if ((0, helpers_1.isSet)(object.retainHeight)) obj.retainHeight = BigInt(object.retainHeight.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.data !== undefined && (obj.data = (0, helpers_1.base64FromBytes)(message.data !== undefined ? message.data : new Uint8Array()));
        message.retainHeight !== undefined && (obj.retainHeight = (message.retainHeight || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseCommit();
        message.data = object.data ?? new Uint8Array();
        if (object.retainHeight !== undefined && object.retainHeight !== null) {
            message.retainHeight = BigInt(object.retainHeight.toString());
        }
        return message;
    }
};
function createBaseResponseListSnapshots() {
    return {
        snapshots: []
    };
}
exports.ResponseListSnapshots = {
    typeUrl: "/tendermint.abci.ResponseListSnapshots",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.snapshots){
            exports.Snapshot.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseListSnapshots();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.snapshots.push(exports.Snapshot.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseListSnapshots();
        if (Array.isArray(object?.snapshots)) obj.snapshots = object.snapshots.map((e)=>exports.Snapshot.fromJSON(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        if (message.snapshots) {
            obj.snapshots = message.snapshots.map((e)=>e ? exports.Snapshot.toJSON(e) : undefined);
        } else {
            obj.snapshots = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseListSnapshots();
        message.snapshots = object.snapshots?.map((e)=>exports.Snapshot.fromPartial(e)) || [];
        return message;
    }
};
function createBaseResponseOfferSnapshot() {
    return {
        result: 0
    };
}
exports.ResponseOfferSnapshot = {
    typeUrl: "/tendermint.abci.ResponseOfferSnapshot",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.result !== 0) {
            writer.uint32(8).int32(message.result);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseOfferSnapshot();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.result = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseOfferSnapshot();
        if ((0, helpers_1.isSet)(object.result)) obj.result = responseOfferSnapshot_ResultFromJSON(object.result);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.result !== undefined && (obj.result = responseOfferSnapshot_ResultToJSON(message.result));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseOfferSnapshot();
        message.result = object.result ?? 0;
        return message;
    }
};
function createBaseResponseLoadSnapshotChunk() {
    return {
        chunk: new Uint8Array()
    };
}
exports.ResponseLoadSnapshotChunk = {
    typeUrl: "/tendermint.abci.ResponseLoadSnapshotChunk",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.chunk.length !== 0) {
            writer.uint32(10).bytes(message.chunk);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseLoadSnapshotChunk();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.chunk = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseLoadSnapshotChunk();
        if ((0, helpers_1.isSet)(object.chunk)) obj.chunk = (0, helpers_1.bytesFromBase64)(object.chunk);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.chunk !== undefined && (obj.chunk = (0, helpers_1.base64FromBytes)(message.chunk !== undefined ? message.chunk : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseLoadSnapshotChunk();
        message.chunk = object.chunk ?? new Uint8Array();
        return message;
    }
};
function createBaseResponseApplySnapshotChunk() {
    return {
        result: 0,
        refetchChunks: [],
        rejectSenders: []
    };
}
exports.ResponseApplySnapshotChunk = {
    typeUrl: "/tendermint.abci.ResponseApplySnapshotChunk",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.result !== 0) {
            writer.uint32(8).int32(message.result);
        }
        writer.uint32(18).fork();
        for (const v of message.refetchChunks){
            writer.uint32(v);
        }
        writer.ldelim();
        for (const v of message.rejectSenders){
            writer.uint32(26).string(v);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseApplySnapshotChunk();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.result = reader.int32();
                    break;
                case 2:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while(reader.pos < end2){
                            message.refetchChunks.push(reader.uint32());
                        }
                    } else {
                        message.refetchChunks.push(reader.uint32());
                    }
                    break;
                case 3:
                    message.rejectSenders.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseApplySnapshotChunk();
        if ((0, helpers_1.isSet)(object.result)) obj.result = responseApplySnapshotChunk_ResultFromJSON(object.result);
        if (Array.isArray(object?.refetchChunks)) obj.refetchChunks = object.refetchChunks.map((e)=>Number(e));
        if (Array.isArray(object?.rejectSenders)) obj.rejectSenders = object.rejectSenders.map((e)=>String(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.result !== undefined && (obj.result = responseApplySnapshotChunk_ResultToJSON(message.result));
        if (message.refetchChunks) {
            obj.refetchChunks = message.refetchChunks.map((e)=>Math.round(e));
        } else {
            obj.refetchChunks = [];
        }
        if (message.rejectSenders) {
            obj.rejectSenders = message.rejectSenders.map((e)=>e);
        } else {
            obj.rejectSenders = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseApplySnapshotChunk();
        message.result = object.result ?? 0;
        message.refetchChunks = object.refetchChunks?.map((e)=>e) || [];
        message.rejectSenders = object.rejectSenders?.map((e)=>e) || [];
        return message;
    }
};
function createBaseResponsePrepareProposal() {
    return {
        txs: []
    };
}
exports.ResponsePrepareProposal = {
    typeUrl: "/tendermint.abci.ResponsePrepareProposal",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.txs){
            writer.uint32(10).bytes(v);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponsePrepareProposal();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.txs.push(reader.bytes());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponsePrepareProposal();
        if (Array.isArray(object?.txs)) obj.txs = object.txs.map((e)=>(0, helpers_1.bytesFromBase64)(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        if (message.txs) {
            obj.txs = message.txs.map((e)=>(0, helpers_1.base64FromBytes)(e !== undefined ? e : new Uint8Array()));
        } else {
            obj.txs = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponsePrepareProposal();
        message.txs = object.txs?.map((e)=>e) || [];
        return message;
    }
};
function createBaseResponseProcessProposal() {
    return {
        status: 0
    };
}
exports.ResponseProcessProposal = {
    typeUrl: "/tendermint.abci.ResponseProcessProposal",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.status !== 0) {
            writer.uint32(8).int32(message.status);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseResponseProcessProposal();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.status = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseResponseProcessProposal();
        if ((0, helpers_1.isSet)(object.status)) obj.status = responseProcessProposal_ProposalStatusFromJSON(object.status);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.status !== undefined && (obj.status = responseProcessProposal_ProposalStatusToJSON(message.status));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseResponseProcessProposal();
        message.status = object.status ?? 0;
        return message;
    }
};
function createBaseCommitInfo() {
    return {
        round: 0,
        votes: []
    };
}
exports.CommitInfo = {
    typeUrl: "/tendermint.abci.CommitInfo",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.round !== 0) {
            writer.uint32(8).int32(message.round);
        }
        for (const v of message.votes){
            exports.VoteInfo.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCommitInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.round = reader.int32();
                    break;
                case 2:
                    message.votes.push(exports.VoteInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseCommitInfo();
        if ((0, helpers_1.isSet)(object.round)) obj.round = Number(object.round);
        if (Array.isArray(object?.votes)) obj.votes = object.votes.map((e)=>exports.VoteInfo.fromJSON(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.round !== undefined && (obj.round = Math.round(message.round));
        if (message.votes) {
            obj.votes = message.votes.map((e)=>e ? exports.VoteInfo.toJSON(e) : undefined);
        } else {
            obj.votes = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseCommitInfo();
        message.round = object.round ?? 0;
        message.votes = object.votes?.map((e)=>exports.VoteInfo.fromPartial(e)) || [];
        return message;
    }
};
function createBaseExtendedCommitInfo() {
    return {
        round: 0,
        votes: []
    };
}
exports.ExtendedCommitInfo = {
    typeUrl: "/tendermint.abci.ExtendedCommitInfo",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.round !== 0) {
            writer.uint32(8).int32(message.round);
        }
        for (const v of message.votes){
            exports.ExtendedVoteInfo.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseExtendedCommitInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.round = reader.int32();
                    break;
                case 2:
                    message.votes.push(exports.ExtendedVoteInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseExtendedCommitInfo();
        if ((0, helpers_1.isSet)(object.round)) obj.round = Number(object.round);
        if (Array.isArray(object?.votes)) obj.votes = object.votes.map((e)=>exports.ExtendedVoteInfo.fromJSON(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.round !== undefined && (obj.round = Math.round(message.round));
        if (message.votes) {
            obj.votes = message.votes.map((e)=>e ? exports.ExtendedVoteInfo.toJSON(e) : undefined);
        } else {
            obj.votes = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseExtendedCommitInfo();
        message.round = object.round ?? 0;
        message.votes = object.votes?.map((e)=>exports.ExtendedVoteInfo.fromPartial(e)) || [];
        return message;
    }
};
function createBaseEvent() {
    return {
        type: "",
        attributes: []
    };
}
exports.Event = {
    typeUrl: "/tendermint.abci.Event",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.type !== "") {
            writer.uint32(10).string(message.type);
        }
        for (const v of message.attributes){
            exports.EventAttribute.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEvent();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.type = reader.string();
                    break;
                case 2:
                    message.attributes.push(exports.EventAttribute.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseEvent();
        if ((0, helpers_1.isSet)(object.type)) obj.type = String(object.type);
        if (Array.isArray(object?.attributes)) obj.attributes = object.attributes.map((e)=>exports.EventAttribute.fromJSON(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.type !== undefined && (obj.type = message.type);
        if (message.attributes) {
            obj.attributes = message.attributes.map((e)=>e ? exports.EventAttribute.toJSON(e) : undefined);
        } else {
            obj.attributes = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseEvent();
        message.type = object.type ?? "";
        message.attributes = object.attributes?.map((e)=>exports.EventAttribute.fromPartial(e)) || [];
        return message;
    }
};
function createBaseEventAttribute() {
    return {
        key: "",
        value: "",
        index: false
    };
}
exports.EventAttribute = {
    typeUrl: "/tendermint.abci.EventAttribute",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== "") {
            writer.uint32(18).string(message.value);
        }
        if (message.index === true) {
            writer.uint32(24).bool(message.index);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEventAttribute();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = reader.string();
                    break;
                case 3:
                    message.index = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseEventAttribute();
        if ((0, helpers_1.isSet)(object.key)) obj.key = String(object.key);
        if ((0, helpers_1.isSet)(object.value)) obj.value = String(object.value);
        if ((0, helpers_1.isSet)(object.index)) obj.index = Boolean(object.index);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value);
        message.index !== undefined && (obj.index = message.index);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseEventAttribute();
        message.key = object.key ?? "";
        message.value = object.value ?? "";
        message.index = object.index ?? false;
        return message;
    }
};
function createBaseTxResult() {
    return {
        height: BigInt(0),
        index: 0,
        tx: new Uint8Array(),
        result: exports.ResponseDeliverTx.fromPartial({})
    };
}
exports.TxResult = {
    typeUrl: "/tendermint.abci.TxResult",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.height !== BigInt(0)) {
            writer.uint32(8).int64(message.height);
        }
        if (message.index !== 0) {
            writer.uint32(16).uint32(message.index);
        }
        if (message.tx.length !== 0) {
            writer.uint32(26).bytes(message.tx);
        }
        if (message.result !== undefined) {
            exports.ResponseDeliverTx.encode(message.result, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTxResult();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.height = reader.int64();
                    break;
                case 2:
                    message.index = reader.uint32();
                    break;
                case 3:
                    message.tx = reader.bytes();
                    break;
                case 4:
                    message.result = exports.ResponseDeliverTx.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseTxResult();
        if ((0, helpers_1.isSet)(object.height)) obj.height = BigInt(object.height.toString());
        if ((0, helpers_1.isSet)(object.index)) obj.index = Number(object.index);
        if ((0, helpers_1.isSet)(object.tx)) obj.tx = (0, helpers_1.bytesFromBase64)(object.tx);
        if ((0, helpers_1.isSet)(object.result)) obj.result = exports.ResponseDeliverTx.fromJSON(object.result);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.height !== undefined && (obj.height = (message.height || BigInt(0)).toString());
        message.index !== undefined && (obj.index = Math.round(message.index));
        message.tx !== undefined && (obj.tx = (0, helpers_1.base64FromBytes)(message.tx !== undefined ? message.tx : new Uint8Array()));
        message.result !== undefined && (obj.result = message.result ? exports.ResponseDeliverTx.toJSON(message.result) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseTxResult();
        if (object.height !== undefined && object.height !== null) {
            message.height = BigInt(object.height.toString());
        }
        message.index = object.index ?? 0;
        message.tx = object.tx ?? new Uint8Array();
        if (object.result !== undefined && object.result !== null) {
            message.result = exports.ResponseDeliverTx.fromPartial(object.result);
        }
        return message;
    }
};
function createBaseValidator() {
    return {
        address: new Uint8Array(),
        power: BigInt(0)
    };
}
exports.Validator = {
    typeUrl: "/tendermint.abci.Validator",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.address.length !== 0) {
            writer.uint32(10).bytes(message.address);
        }
        if (message.power !== BigInt(0)) {
            writer.uint32(24).int64(message.power);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseValidator();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.address = reader.bytes();
                    break;
                case 3:
                    message.power = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseValidator();
        if ((0, helpers_1.isSet)(object.address)) obj.address = (0, helpers_1.bytesFromBase64)(object.address);
        if ((0, helpers_1.isSet)(object.power)) obj.power = BigInt(object.power.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.address !== undefined && (obj.address = (0, helpers_1.base64FromBytes)(message.address !== undefined ? message.address : new Uint8Array()));
        message.power !== undefined && (obj.power = (message.power || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseValidator();
        message.address = object.address ?? new Uint8Array();
        if (object.power !== undefined && object.power !== null) {
            message.power = BigInt(object.power.toString());
        }
        return message;
    }
};
function createBaseValidatorUpdate() {
    return {
        pubKey: keys_1.PublicKey.fromPartial({}),
        power: BigInt(0)
    };
}
exports.ValidatorUpdate = {
    typeUrl: "/tendermint.abci.ValidatorUpdate",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.pubKey !== undefined) {
            keys_1.PublicKey.encode(message.pubKey, writer.uint32(10).fork()).ldelim();
        }
        if (message.power !== BigInt(0)) {
            writer.uint32(16).int64(message.power);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseValidatorUpdate();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.pubKey = keys_1.PublicKey.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.power = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseValidatorUpdate();
        if ((0, helpers_1.isSet)(object.pubKey)) obj.pubKey = keys_1.PublicKey.fromJSON(object.pubKey);
        if ((0, helpers_1.isSet)(object.power)) obj.power = BigInt(object.power.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.pubKey !== undefined && (obj.pubKey = message.pubKey ? keys_1.PublicKey.toJSON(message.pubKey) : undefined);
        message.power !== undefined && (obj.power = (message.power || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseValidatorUpdate();
        if (object.pubKey !== undefined && object.pubKey !== null) {
            message.pubKey = keys_1.PublicKey.fromPartial(object.pubKey);
        }
        if (object.power !== undefined && object.power !== null) {
            message.power = BigInt(object.power.toString());
        }
        return message;
    }
};
function createBaseVoteInfo() {
    return {
        validator: exports.Validator.fromPartial({}),
        signedLastBlock: false
    };
}
exports.VoteInfo = {
    typeUrl: "/tendermint.abci.VoteInfo",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.validator !== undefined) {
            exports.Validator.encode(message.validator, writer.uint32(10).fork()).ldelim();
        }
        if (message.signedLastBlock === true) {
            writer.uint32(16).bool(message.signedLastBlock);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVoteInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.validator = exports.Validator.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.signedLastBlock = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseVoteInfo();
        if ((0, helpers_1.isSet)(object.validator)) obj.validator = exports.Validator.fromJSON(object.validator);
        if ((0, helpers_1.isSet)(object.signedLastBlock)) obj.signedLastBlock = Boolean(object.signedLastBlock);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.validator !== undefined && (obj.validator = message.validator ? exports.Validator.toJSON(message.validator) : undefined);
        message.signedLastBlock !== undefined && (obj.signedLastBlock = message.signedLastBlock);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseVoteInfo();
        if (object.validator !== undefined && object.validator !== null) {
            message.validator = exports.Validator.fromPartial(object.validator);
        }
        message.signedLastBlock = object.signedLastBlock ?? false;
        return message;
    }
};
function createBaseExtendedVoteInfo() {
    return {
        validator: exports.Validator.fromPartial({}),
        signedLastBlock: false,
        voteExtension: new Uint8Array()
    };
}
exports.ExtendedVoteInfo = {
    typeUrl: "/tendermint.abci.ExtendedVoteInfo",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.validator !== undefined) {
            exports.Validator.encode(message.validator, writer.uint32(10).fork()).ldelim();
        }
        if (message.signedLastBlock === true) {
            writer.uint32(16).bool(message.signedLastBlock);
        }
        if (message.voteExtension.length !== 0) {
            writer.uint32(26).bytes(message.voteExtension);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseExtendedVoteInfo();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.validator = exports.Validator.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.signedLastBlock = reader.bool();
                    break;
                case 3:
                    message.voteExtension = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseExtendedVoteInfo();
        if ((0, helpers_1.isSet)(object.validator)) obj.validator = exports.Validator.fromJSON(object.validator);
        if ((0, helpers_1.isSet)(object.signedLastBlock)) obj.signedLastBlock = Boolean(object.signedLastBlock);
        if ((0, helpers_1.isSet)(object.voteExtension)) obj.voteExtension = (0, helpers_1.bytesFromBase64)(object.voteExtension);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.validator !== undefined && (obj.validator = message.validator ? exports.Validator.toJSON(message.validator) : undefined);
        message.signedLastBlock !== undefined && (obj.signedLastBlock = message.signedLastBlock);
        message.voteExtension !== undefined && (obj.voteExtension = (0, helpers_1.base64FromBytes)(message.voteExtension !== undefined ? message.voteExtension : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseExtendedVoteInfo();
        if (object.validator !== undefined && object.validator !== null) {
            message.validator = exports.Validator.fromPartial(object.validator);
        }
        message.signedLastBlock = object.signedLastBlock ?? false;
        message.voteExtension = object.voteExtension ?? new Uint8Array();
        return message;
    }
};
function createBaseMisbehavior() {
    return {
        type: 0,
        validator: exports.Validator.fromPartial({}),
        height: BigInt(0),
        time: timestamp_1.Timestamp.fromPartial({}),
        totalVotingPower: BigInt(0)
    };
}
exports.Misbehavior = {
    typeUrl: "/tendermint.abci.Misbehavior",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.type !== 0) {
            writer.uint32(8).int32(message.type);
        }
        if (message.validator !== undefined) {
            exports.Validator.encode(message.validator, writer.uint32(18).fork()).ldelim();
        }
        if (message.height !== BigInt(0)) {
            writer.uint32(24).int64(message.height);
        }
        if (message.time !== undefined) {
            timestamp_1.Timestamp.encode(message.time, writer.uint32(34).fork()).ldelim();
        }
        if (message.totalVotingPower !== BigInt(0)) {
            writer.uint32(40).int64(message.totalVotingPower);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMisbehavior();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.validator = exports.Validator.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.height = reader.int64();
                    break;
                case 4:
                    message.time = timestamp_1.Timestamp.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.totalVotingPower = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseMisbehavior();
        if ((0, helpers_1.isSet)(object.type)) obj.type = misbehaviorTypeFromJSON(object.type);
        if ((0, helpers_1.isSet)(object.validator)) obj.validator = exports.Validator.fromJSON(object.validator);
        if ((0, helpers_1.isSet)(object.height)) obj.height = BigInt(object.height.toString());
        if ((0, helpers_1.isSet)(object.time)) obj.time = (0, helpers_1.fromJsonTimestamp)(object.time);
        if ((0, helpers_1.isSet)(object.totalVotingPower)) obj.totalVotingPower = BigInt(object.totalVotingPower.toString());
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.type !== undefined && (obj.type = misbehaviorTypeToJSON(message.type));
        message.validator !== undefined && (obj.validator = message.validator ? exports.Validator.toJSON(message.validator) : undefined);
        message.height !== undefined && (obj.height = (message.height || BigInt(0)).toString());
        message.time !== undefined && (obj.time = (0, helpers_1.fromTimestamp)(message.time).toISOString());
        message.totalVotingPower !== undefined && (obj.totalVotingPower = (message.totalVotingPower || BigInt(0)).toString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseMisbehavior();
        message.type = object.type ?? 0;
        if (object.validator !== undefined && object.validator !== null) {
            message.validator = exports.Validator.fromPartial(object.validator);
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = BigInt(object.height.toString());
        }
        if (object.time !== undefined && object.time !== null) {
            message.time = timestamp_1.Timestamp.fromPartial(object.time);
        }
        if (object.totalVotingPower !== undefined && object.totalVotingPower !== null) {
            message.totalVotingPower = BigInt(object.totalVotingPower.toString());
        }
        return message;
    }
};
function createBaseSnapshot() {
    return {
        height: BigInt(0),
        format: 0,
        chunks: 0,
        hash: new Uint8Array(),
        metadata: new Uint8Array()
    };
}
exports.Snapshot = {
    typeUrl: "/tendermint.abci.Snapshot",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.height !== BigInt(0)) {
            writer.uint32(8).uint64(message.height);
        }
        if (message.format !== 0) {
            writer.uint32(16).uint32(message.format);
        }
        if (message.chunks !== 0) {
            writer.uint32(24).uint32(message.chunks);
        }
        if (message.hash.length !== 0) {
            writer.uint32(34).bytes(message.hash);
        }
        if (message.metadata.length !== 0) {
            writer.uint32(42).bytes(message.metadata);
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSnapshot();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.height = reader.uint64();
                    break;
                case 2:
                    message.format = reader.uint32();
                    break;
                case 3:
                    message.chunks = reader.uint32();
                    break;
                case 4:
                    message.hash = reader.bytes();
                    break;
                case 5:
                    message.metadata = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseSnapshot();
        if ((0, helpers_1.isSet)(object.height)) obj.height = BigInt(object.height.toString());
        if ((0, helpers_1.isSet)(object.format)) obj.format = Number(object.format);
        if ((0, helpers_1.isSet)(object.chunks)) obj.chunks = Number(object.chunks);
        if ((0, helpers_1.isSet)(object.hash)) obj.hash = (0, helpers_1.bytesFromBase64)(object.hash);
        if ((0, helpers_1.isSet)(object.metadata)) obj.metadata = (0, helpers_1.bytesFromBase64)(object.metadata);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.height !== undefined && (obj.height = (message.height || BigInt(0)).toString());
        message.format !== undefined && (obj.format = Math.round(message.format));
        message.chunks !== undefined && (obj.chunks = Math.round(message.chunks));
        message.hash !== undefined && (obj.hash = (0, helpers_1.base64FromBytes)(message.hash !== undefined ? message.hash : new Uint8Array()));
        message.metadata !== undefined && (obj.metadata = (0, helpers_1.base64FromBytes)(message.metadata !== undefined ? message.metadata : new Uint8Array()));
        return obj;
    },
    fromPartial (object) {
        const message = createBaseSnapshot();
        if (object.height !== undefined && object.height !== null) {
            message.height = BigInt(object.height.toString());
        }
        message.format = object.format ?? 0;
        message.chunks = object.chunks ?? 0;
        message.hash = object.hash ?? new Uint8Array();
        message.metadata = object.metadata ?? new Uint8Array();
        return message;
    }
};
class ABCIApplicationClientImpl {
    constructor(rpc){
        this.rpc = rpc;
        this.Echo = this.Echo.bind(this);
        this.Flush = this.Flush.bind(this);
        this.Info = this.Info.bind(this);
        this.DeliverTx = this.DeliverTx.bind(this);
        this.CheckTx = this.CheckTx.bind(this);
        this.Query = this.Query.bind(this);
        this.Commit = this.Commit.bind(this);
        this.InitChain = this.InitChain.bind(this);
        this.BeginBlock = this.BeginBlock.bind(this);
        this.EndBlock = this.EndBlock.bind(this);
        this.ListSnapshots = this.ListSnapshots.bind(this);
        this.OfferSnapshot = this.OfferSnapshot.bind(this);
        this.LoadSnapshotChunk = this.LoadSnapshotChunk.bind(this);
        this.ApplySnapshotChunk = this.ApplySnapshotChunk.bind(this);
        this.PrepareProposal = this.PrepareProposal.bind(this);
        this.ProcessProposal = this.ProcessProposal.bind(this);
    }
    Echo(request) {
        const data = exports.RequestEcho.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "Echo", data);
        return promise.then((data)=>exports.ResponseEcho.decode(new binary_1.BinaryReader(data)));
    }
    Flush(request = {}) {
        const data = exports.RequestFlush.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "Flush", data);
        return promise.then((data)=>exports.ResponseFlush.decode(new binary_1.BinaryReader(data)));
    }
    Info(request) {
        const data = exports.RequestInfo.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "Info", data);
        return promise.then((data)=>exports.ResponseInfo.decode(new binary_1.BinaryReader(data)));
    }
    DeliverTx(request) {
        const data = exports.RequestDeliverTx.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "DeliverTx", data);
        return promise.then((data)=>exports.ResponseDeliverTx.decode(new binary_1.BinaryReader(data)));
    }
    CheckTx(request) {
        const data = exports.RequestCheckTx.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "CheckTx", data);
        return promise.then((data)=>exports.ResponseCheckTx.decode(new binary_1.BinaryReader(data)));
    }
    Query(request) {
        const data = exports.RequestQuery.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "Query", data);
        return promise.then((data)=>exports.ResponseQuery.decode(new binary_1.BinaryReader(data)));
    }
    Commit(request = {}) {
        const data = exports.RequestCommit.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "Commit", data);
        return promise.then((data)=>exports.ResponseCommit.decode(new binary_1.BinaryReader(data)));
    }
    InitChain(request) {
        const data = exports.RequestInitChain.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "InitChain", data);
        return promise.then((data)=>exports.ResponseInitChain.decode(new binary_1.BinaryReader(data)));
    }
    BeginBlock(request) {
        const data = exports.RequestBeginBlock.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "BeginBlock", data);
        return promise.then((data)=>exports.ResponseBeginBlock.decode(new binary_1.BinaryReader(data)));
    }
    EndBlock(request) {
        const data = exports.RequestEndBlock.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "EndBlock", data);
        return promise.then((data)=>exports.ResponseEndBlock.decode(new binary_1.BinaryReader(data)));
    }
    ListSnapshots(request = {}) {
        const data = exports.RequestListSnapshots.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "ListSnapshots", data);
        return promise.then((data)=>exports.ResponseListSnapshots.decode(new binary_1.BinaryReader(data)));
    }
    OfferSnapshot(request) {
        const data = exports.RequestOfferSnapshot.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "OfferSnapshot", data);
        return promise.then((data)=>exports.ResponseOfferSnapshot.decode(new binary_1.BinaryReader(data)));
    }
    LoadSnapshotChunk(request) {
        const data = exports.RequestLoadSnapshotChunk.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "LoadSnapshotChunk", data);
        return promise.then((data)=>exports.ResponseLoadSnapshotChunk.decode(new binary_1.BinaryReader(data)));
    }
    ApplySnapshotChunk(request) {
        const data = exports.RequestApplySnapshotChunk.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "ApplySnapshotChunk", data);
        return promise.then((data)=>exports.ResponseApplySnapshotChunk.decode(new binary_1.BinaryReader(data)));
    }
    PrepareProposal(request) {
        const data = exports.RequestPrepareProposal.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "PrepareProposal", data);
        return promise.then((data)=>exports.ResponsePrepareProposal.decode(new binary_1.BinaryReader(data)));
    }
    ProcessProposal(request) {
        const data = exports.RequestProcessProposal.encode(request).finish();
        const promise = this.rpc.request("tendermint.abci.ABCIApplication", "ProcessProposal", data);
        return promise.then((data)=>exports.ResponseProcessProposal.decode(new binary_1.BinaryReader(data)));
    }
}
exports.ABCIApplicationClientImpl = ABCIApplicationClientImpl; //# sourceMappingURL=types.js.map
}),
"[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/types/evidence.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EvidenceList = exports.LightClientAttackEvidence = exports.DuplicateVoteEvidence = exports.Evidence = exports.protobufPackage = void 0;
/* eslint-disable */ const types_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/types/types.js [client] (ecmascript)");
const timestamp_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/google/protobuf/timestamp.js [client] (ecmascript)");
const validator_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/types/validator.js [client] (ecmascript)");
const binary_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/binary.js [client] (ecmascript)");
const helpers_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/helpers.js [client] (ecmascript)");
exports.protobufPackage = "tendermint.types";
function createBaseEvidence() {
    return {
        duplicateVoteEvidence: undefined,
        lightClientAttackEvidence: undefined
    };
}
exports.Evidence = {
    typeUrl: "/tendermint.types.Evidence",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.duplicateVoteEvidence !== undefined) {
            exports.DuplicateVoteEvidence.encode(message.duplicateVoteEvidence, writer.uint32(10).fork()).ldelim();
        }
        if (message.lightClientAttackEvidence !== undefined) {
            exports.LightClientAttackEvidence.encode(message.lightClientAttackEvidence, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEvidence();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.duplicateVoteEvidence = exports.DuplicateVoteEvidence.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.lightClientAttackEvidence = exports.LightClientAttackEvidence.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseEvidence();
        if ((0, helpers_1.isSet)(object.duplicateVoteEvidence)) obj.duplicateVoteEvidence = exports.DuplicateVoteEvidence.fromJSON(object.duplicateVoteEvidence);
        if ((0, helpers_1.isSet)(object.lightClientAttackEvidence)) obj.lightClientAttackEvidence = exports.LightClientAttackEvidence.fromJSON(object.lightClientAttackEvidence);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.duplicateVoteEvidence !== undefined && (obj.duplicateVoteEvidence = message.duplicateVoteEvidence ? exports.DuplicateVoteEvidence.toJSON(message.duplicateVoteEvidence) : undefined);
        message.lightClientAttackEvidence !== undefined && (obj.lightClientAttackEvidence = message.lightClientAttackEvidence ? exports.LightClientAttackEvidence.toJSON(message.lightClientAttackEvidence) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseEvidence();
        if (object.duplicateVoteEvidence !== undefined && object.duplicateVoteEvidence !== null) {
            message.duplicateVoteEvidence = exports.DuplicateVoteEvidence.fromPartial(object.duplicateVoteEvidence);
        }
        if (object.lightClientAttackEvidence !== undefined && object.lightClientAttackEvidence !== null) {
            message.lightClientAttackEvidence = exports.LightClientAttackEvidence.fromPartial(object.lightClientAttackEvidence);
        }
        return message;
    }
};
function createBaseDuplicateVoteEvidence() {
    return {
        voteA: undefined,
        voteB: undefined,
        totalVotingPower: BigInt(0),
        validatorPower: BigInt(0),
        timestamp: timestamp_1.Timestamp.fromPartial({})
    };
}
exports.DuplicateVoteEvidence = {
    typeUrl: "/tendermint.types.DuplicateVoteEvidence",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.voteA !== undefined) {
            types_1.Vote.encode(message.voteA, writer.uint32(10).fork()).ldelim();
        }
        if (message.voteB !== undefined) {
            types_1.Vote.encode(message.voteB, writer.uint32(18).fork()).ldelim();
        }
        if (message.totalVotingPower !== BigInt(0)) {
            writer.uint32(24).int64(message.totalVotingPower);
        }
        if (message.validatorPower !== BigInt(0)) {
            writer.uint32(32).int64(message.validatorPower);
        }
        if (message.timestamp !== undefined) {
            timestamp_1.Timestamp.encode(message.timestamp, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDuplicateVoteEvidence();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.voteA = types_1.Vote.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.voteB = types_1.Vote.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.totalVotingPower = reader.int64();
                    break;
                case 4:
                    message.validatorPower = reader.int64();
                    break;
                case 5:
                    message.timestamp = timestamp_1.Timestamp.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseDuplicateVoteEvidence();
        if ((0, helpers_1.isSet)(object.voteA)) obj.voteA = types_1.Vote.fromJSON(object.voteA);
        if ((0, helpers_1.isSet)(object.voteB)) obj.voteB = types_1.Vote.fromJSON(object.voteB);
        if ((0, helpers_1.isSet)(object.totalVotingPower)) obj.totalVotingPower = BigInt(object.totalVotingPower.toString());
        if ((0, helpers_1.isSet)(object.validatorPower)) obj.validatorPower = BigInt(object.validatorPower.toString());
        if ((0, helpers_1.isSet)(object.timestamp)) obj.timestamp = (0, helpers_1.fromJsonTimestamp)(object.timestamp);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.voteA !== undefined && (obj.voteA = message.voteA ? types_1.Vote.toJSON(message.voteA) : undefined);
        message.voteB !== undefined && (obj.voteB = message.voteB ? types_1.Vote.toJSON(message.voteB) : undefined);
        message.totalVotingPower !== undefined && (obj.totalVotingPower = (message.totalVotingPower || BigInt(0)).toString());
        message.validatorPower !== undefined && (obj.validatorPower = (message.validatorPower || BigInt(0)).toString());
        message.timestamp !== undefined && (obj.timestamp = (0, helpers_1.fromTimestamp)(message.timestamp).toISOString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseDuplicateVoteEvidence();
        if (object.voteA !== undefined && object.voteA !== null) {
            message.voteA = types_1.Vote.fromPartial(object.voteA);
        }
        if (object.voteB !== undefined && object.voteB !== null) {
            message.voteB = types_1.Vote.fromPartial(object.voteB);
        }
        if (object.totalVotingPower !== undefined && object.totalVotingPower !== null) {
            message.totalVotingPower = BigInt(object.totalVotingPower.toString());
        }
        if (object.validatorPower !== undefined && object.validatorPower !== null) {
            message.validatorPower = BigInt(object.validatorPower.toString());
        }
        if (object.timestamp !== undefined && object.timestamp !== null) {
            message.timestamp = timestamp_1.Timestamp.fromPartial(object.timestamp);
        }
        return message;
    }
};
function createBaseLightClientAttackEvidence() {
    return {
        conflictingBlock: undefined,
        commonHeight: BigInt(0),
        byzantineValidators: [],
        totalVotingPower: BigInt(0),
        timestamp: timestamp_1.Timestamp.fromPartial({})
    };
}
exports.LightClientAttackEvidence = {
    typeUrl: "/tendermint.types.LightClientAttackEvidence",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.conflictingBlock !== undefined) {
            types_1.LightBlock.encode(message.conflictingBlock, writer.uint32(10).fork()).ldelim();
        }
        if (message.commonHeight !== BigInt(0)) {
            writer.uint32(16).int64(message.commonHeight);
        }
        for (const v of message.byzantineValidators){
            validator_1.Validator.encode(v, writer.uint32(26).fork()).ldelim();
        }
        if (message.totalVotingPower !== BigInt(0)) {
            writer.uint32(32).int64(message.totalVotingPower);
        }
        if (message.timestamp !== undefined) {
            timestamp_1.Timestamp.encode(message.timestamp, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLightClientAttackEvidence();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.conflictingBlock = types_1.LightBlock.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.commonHeight = reader.int64();
                    break;
                case 3:
                    message.byzantineValidators.push(validator_1.Validator.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.totalVotingPower = reader.int64();
                    break;
                case 5:
                    message.timestamp = timestamp_1.Timestamp.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseLightClientAttackEvidence();
        if ((0, helpers_1.isSet)(object.conflictingBlock)) obj.conflictingBlock = types_1.LightBlock.fromJSON(object.conflictingBlock);
        if ((0, helpers_1.isSet)(object.commonHeight)) obj.commonHeight = BigInt(object.commonHeight.toString());
        if (Array.isArray(object?.byzantineValidators)) obj.byzantineValidators = object.byzantineValidators.map((e)=>validator_1.Validator.fromJSON(e));
        if ((0, helpers_1.isSet)(object.totalVotingPower)) obj.totalVotingPower = BigInt(object.totalVotingPower.toString());
        if ((0, helpers_1.isSet)(object.timestamp)) obj.timestamp = (0, helpers_1.fromJsonTimestamp)(object.timestamp);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.conflictingBlock !== undefined && (obj.conflictingBlock = message.conflictingBlock ? types_1.LightBlock.toJSON(message.conflictingBlock) : undefined);
        message.commonHeight !== undefined && (obj.commonHeight = (message.commonHeight || BigInt(0)).toString());
        if (message.byzantineValidators) {
            obj.byzantineValidators = message.byzantineValidators.map((e)=>e ? validator_1.Validator.toJSON(e) : undefined);
        } else {
            obj.byzantineValidators = [];
        }
        message.totalVotingPower !== undefined && (obj.totalVotingPower = (message.totalVotingPower || BigInt(0)).toString());
        message.timestamp !== undefined && (obj.timestamp = (0, helpers_1.fromTimestamp)(message.timestamp).toISOString());
        return obj;
    },
    fromPartial (object) {
        const message = createBaseLightClientAttackEvidence();
        if (object.conflictingBlock !== undefined && object.conflictingBlock !== null) {
            message.conflictingBlock = types_1.LightBlock.fromPartial(object.conflictingBlock);
        }
        if (object.commonHeight !== undefined && object.commonHeight !== null) {
            message.commonHeight = BigInt(object.commonHeight.toString());
        }
        message.byzantineValidators = object.byzantineValidators?.map((e)=>validator_1.Validator.fromPartial(e)) || [];
        if (object.totalVotingPower !== undefined && object.totalVotingPower !== null) {
            message.totalVotingPower = BigInt(object.totalVotingPower.toString());
        }
        if (object.timestamp !== undefined && object.timestamp !== null) {
            message.timestamp = timestamp_1.Timestamp.fromPartial(object.timestamp);
        }
        return message;
    }
};
function createBaseEvidenceList() {
    return {
        evidence: []
    };
}
exports.EvidenceList = {
    typeUrl: "/tendermint.types.EvidenceList",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        for (const v of message.evidence){
            exports.Evidence.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseEvidenceList();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.evidence.push(exports.Evidence.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseEvidenceList();
        if (Array.isArray(object?.evidence)) obj.evidence = object.evidence.map((e)=>exports.Evidence.fromJSON(e));
        return obj;
    },
    toJSON (message) {
        const obj = {};
        if (message.evidence) {
            obj.evidence = message.evidence.map((e)=>e ? exports.Evidence.toJSON(e) : undefined);
        } else {
            obj.evidence = [];
        }
        return obj;
    },
    fromPartial (object) {
        const message = createBaseEvidenceList();
        message.evidence = object.evidence?.map((e)=>exports.Evidence.fromPartial(e)) || [];
        return message;
    }
}; //# sourceMappingURL=evidence.js.map
}),
"[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/types/block.js [client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Block = exports.protobufPackage = void 0;
/* eslint-disable */ const types_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/types/types.js [client] (ecmascript)");
const evidence_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/tendermint/types/evidence.js [client] (ecmascript)");
const binary_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/binary.js [client] (ecmascript)");
const helpers_1 = __turbopack_context__.r("[project]/node_modules/@cosmjs/stargate/node_modules/cosmjs-types/helpers.js [client] (ecmascript)");
exports.protobufPackage = "tendermint.types";
function createBaseBlock() {
    return {
        header: types_1.Header.fromPartial({}),
        data: types_1.Data.fromPartial({}),
        evidence: evidence_1.EvidenceList.fromPartial({}),
        lastCommit: undefined
    };
}
exports.Block = {
    typeUrl: "/tendermint.types.Block",
    encode (message, writer = binary_1.BinaryWriter.create()) {
        if (message.header !== undefined) {
            types_1.Header.encode(message.header, writer.uint32(10).fork()).ldelim();
        }
        if (message.data !== undefined) {
            types_1.Data.encode(message.data, writer.uint32(18).fork()).ldelim();
        }
        if (message.evidence !== undefined) {
            evidence_1.EvidenceList.encode(message.evidence, writer.uint32(26).fork()).ldelim();
        }
        if (message.lastCommit !== undefined) {
            types_1.Commit.encode(message.lastCommit, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode (input, length) {
        const reader = input instanceof binary_1.BinaryReader ? input : new binary_1.BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBlock();
        while(reader.pos < end){
            const tag = reader.uint32();
            switch(tag >>> 3){
                case 1:
                    message.header = types_1.Header.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.data = types_1.Data.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.evidence = evidence_1.EvidenceList.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.lastCommit = types_1.Commit.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON (object) {
        const obj = createBaseBlock();
        if ((0, helpers_1.isSet)(object.header)) obj.header = types_1.Header.fromJSON(object.header);
        if ((0, helpers_1.isSet)(object.data)) obj.data = types_1.Data.fromJSON(object.data);
        if ((0, helpers_1.isSet)(object.evidence)) obj.evidence = evidence_1.EvidenceList.fromJSON(object.evidence);
        if ((0, helpers_1.isSet)(object.lastCommit)) obj.lastCommit = types_1.Commit.fromJSON(object.lastCommit);
        return obj;
    },
    toJSON (message) {
        const obj = {};
        message.header !== undefined && (obj.header = message.header ? types_1.Header.toJSON(message.header) : undefined);
        message.data !== undefined && (obj.data = message.data ? types_1.Data.toJSON(message.data) : undefined);
        message.evidence !== undefined && (obj.evidence = message.evidence ? evidence_1.EvidenceList.toJSON(message.evidence) : undefined);
        message.lastCommit !== undefined && (obj.lastCommit = message.lastCommit ? types_1.Commit.toJSON(message.lastCommit) : undefined);
        return obj;
    },
    fromPartial (object) {
        const message = createBaseBlock();
        if (object.header !== undefined && object.header !== null) {
            message.header = types_1.Header.fromPartial(object.header);
        }
        if (object.data !== undefined && object.data !== null) {
            message.data = types_1.Data.fromPartial(object.data);
        }
        if (object.evidence !== undefined && object.evidence !== null) {
            message.evidence = evidence_1.EvidenceList.fromPartial(object.evidence);
        }
        if (object.lastCommit !== undefined && object.lastCommit !== null) {
            message.lastCommit = types_1.Commit.fromPartial(object.lastCommit);
        }
        return message;
    }
}; //# sourceMappingURL=block.js.map
}),
]);

//# sourceMappingURL=84862_cosmjs-types_tendermint_61a18cca._.js.map