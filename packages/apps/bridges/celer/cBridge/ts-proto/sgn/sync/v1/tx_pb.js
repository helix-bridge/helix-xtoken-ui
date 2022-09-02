// source: sgn/sync/v1/tx.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = (function() {
  if (this) { return this; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  if (typeof self !== 'undefined') { return self; }
  return Function('return this')();
}.call(null));

var gogoproto_gogo_pb = require('../../../gogoproto/gogo_pb.js');
goog.object.extend(proto, gogoproto_gogo_pb);
var sgn_sync_v1_sync_pb = require('../../../sgn/sync/v1/sync_pb.js');
goog.object.extend(proto, sgn_sync_v1_sync_pb);
goog.exportSymbol('proto.sgn.sync.v1.MsgProposeUpdates', null, global);
goog.exportSymbol('proto.sgn.sync.v1.MsgVoteUpdates', null, global);
goog.exportSymbol('proto.sgn.sync.v1.ProposeUpdate', null, global);
goog.exportSymbol('proto.sgn.sync.v1.VoteUpdate', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.sync.v1.ProposeUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.sync.v1.ProposeUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.sync.v1.ProposeUpdate.displayName = 'proto.sgn.sync.v1.ProposeUpdate';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.sync.v1.MsgProposeUpdates = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.sync.v1.MsgProposeUpdates.repeatedFields_, null);
};
goog.inherits(proto.sgn.sync.v1.MsgProposeUpdates, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.sync.v1.MsgProposeUpdates.displayName = 'proto.sgn.sync.v1.MsgProposeUpdates';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.sync.v1.VoteUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.sync.v1.VoteUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.sync.v1.VoteUpdate.displayName = 'proto.sgn.sync.v1.VoteUpdate';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.sync.v1.MsgVoteUpdates = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.sync.v1.MsgVoteUpdates.repeatedFields_, null);
};
goog.inherits(proto.sgn.sync.v1.MsgVoteUpdates, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.sync.v1.MsgVoteUpdates.displayName = 'proto.sgn.sync.v1.MsgVoteUpdates';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.sync.v1.ProposeUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.sync.v1.ProposeUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.sync.v1.ProposeUpdate} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.sync.v1.ProposeUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    type: jspb.Message.getFieldWithDefault(msg, 1, 0),
    data: msg.getData_asB64(),
    chainId: jspb.Message.getFieldWithDefault(msg, 3, 0),
    chainBlock: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.sync.v1.ProposeUpdate}
 */
proto.sgn.sync.v1.ProposeUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.sync.v1.ProposeUpdate;
  return proto.sgn.sync.v1.ProposeUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.sync.v1.ProposeUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.sync.v1.ProposeUpdate}
 */
proto.sgn.sync.v1.ProposeUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.sgn.sync.v1.DataType} */ (reader.readEnum());
      msg.setType(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setChainId(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setChainBlock(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.sync.v1.ProposeUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.sync.v1.ProposeUpdate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.sync.v1.ProposeUpdate} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.sync.v1.ProposeUpdate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getChainId();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getChainBlock();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
};


/**
 * optional DataType type = 1;
 * @return {!proto.sgn.sync.v1.DataType}
 */
proto.sgn.sync.v1.ProposeUpdate.prototype.getType = function() {
  return /** @type {!proto.sgn.sync.v1.DataType} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.sgn.sync.v1.DataType} value
 * @return {!proto.sgn.sync.v1.ProposeUpdate} returns this
 */
proto.sgn.sync.v1.ProposeUpdate.prototype.setType = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional bytes data = 2;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.sync.v1.ProposeUpdate.prototype.getData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes data = 2;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.sgn.sync.v1.ProposeUpdate.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * optional bytes data = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.sgn.sync.v1.ProposeUpdate.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.sync.v1.ProposeUpdate} returns this
 */
proto.sgn.sync.v1.ProposeUpdate.prototype.setData = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional uint64 chain_id = 3;
 * @return {number}
 */
proto.sgn.sync.v1.ProposeUpdate.prototype.getChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.sync.v1.ProposeUpdate} returns this
 */
proto.sgn.sync.v1.ProposeUpdate.prototype.setChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional uint64 chain_block = 4;
 * @return {number}
 */
proto.sgn.sync.v1.ProposeUpdate.prototype.getChainBlock = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.sync.v1.ProposeUpdate} returns this
 */
proto.sgn.sync.v1.ProposeUpdate.prototype.setChainBlock = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.sync.v1.MsgProposeUpdates.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.sync.v1.MsgProposeUpdates.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.sync.v1.MsgProposeUpdates.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.sync.v1.MsgProposeUpdates} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.sync.v1.MsgProposeUpdates.toObject = function(includeInstance, msg) {
  var f, obj = {
    updatesList: jspb.Message.toObjectList(msg.getUpdatesList(),
    proto.sgn.sync.v1.ProposeUpdate.toObject, includeInstance),
    sender: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.sync.v1.MsgProposeUpdates}
 */
proto.sgn.sync.v1.MsgProposeUpdates.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.sync.v1.MsgProposeUpdates;
  return proto.sgn.sync.v1.MsgProposeUpdates.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.sync.v1.MsgProposeUpdates} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.sync.v1.MsgProposeUpdates}
 */
proto.sgn.sync.v1.MsgProposeUpdates.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.sync.v1.ProposeUpdate;
      reader.readMessage(value,proto.sgn.sync.v1.ProposeUpdate.deserializeBinaryFromReader);
      msg.addUpdates(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSender(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.sync.v1.MsgProposeUpdates.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.sync.v1.MsgProposeUpdates.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.sync.v1.MsgProposeUpdates} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.sync.v1.MsgProposeUpdates.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUpdatesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.sgn.sync.v1.ProposeUpdate.serializeBinaryToWriter
    );
  }
  f = message.getSender();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * repeated ProposeUpdate updates = 1;
 * @return {!Array<!proto.sgn.sync.v1.ProposeUpdate>}
 */
proto.sgn.sync.v1.MsgProposeUpdates.prototype.getUpdatesList = function() {
  return /** @type{!Array<!proto.sgn.sync.v1.ProposeUpdate>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.sync.v1.ProposeUpdate, 1));
};


/**
 * @param {!Array<!proto.sgn.sync.v1.ProposeUpdate>} value
 * @return {!proto.sgn.sync.v1.MsgProposeUpdates} returns this
*/
proto.sgn.sync.v1.MsgProposeUpdates.prototype.setUpdatesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.sgn.sync.v1.ProposeUpdate=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.sync.v1.ProposeUpdate}
 */
proto.sgn.sync.v1.MsgProposeUpdates.prototype.addUpdates = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.sgn.sync.v1.ProposeUpdate, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.sync.v1.MsgProposeUpdates} returns this
 */
proto.sgn.sync.v1.MsgProposeUpdates.prototype.clearUpdatesList = function() {
  return this.setUpdatesList([]);
};


/**
 * optional string sender = 2;
 * @return {string}
 */
proto.sgn.sync.v1.MsgProposeUpdates.prototype.getSender = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.sync.v1.MsgProposeUpdates} returns this
 */
proto.sgn.sync.v1.MsgProposeUpdates.prototype.setSender = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.sync.v1.VoteUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.sync.v1.VoteUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.sync.v1.VoteUpdate} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.sync.v1.VoteUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0),
    option: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.sync.v1.VoteUpdate}
 */
proto.sgn.sync.v1.VoteUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.sync.v1.VoteUpdate;
  return proto.sgn.sync.v1.VoteUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.sync.v1.VoteUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.sync.v1.VoteUpdate}
 */
proto.sgn.sync.v1.VoteUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {!proto.sgn.sync.v1.VoteOption} */ (reader.readEnum());
      msg.setOption(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.sync.v1.VoteUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.sync.v1.VoteUpdate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.sync.v1.VoteUpdate} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.sync.v1.VoteUpdate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getOption();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional uint64 id = 1;
 * @return {number}
 */
proto.sgn.sync.v1.VoteUpdate.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.sync.v1.VoteUpdate} returns this
 */
proto.sgn.sync.v1.VoteUpdate.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional VoteOption option = 2;
 * @return {!proto.sgn.sync.v1.VoteOption}
 */
proto.sgn.sync.v1.VoteUpdate.prototype.getOption = function() {
  return /** @type {!proto.sgn.sync.v1.VoteOption} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.sgn.sync.v1.VoteOption} value
 * @return {!proto.sgn.sync.v1.VoteUpdate} returns this
 */
proto.sgn.sync.v1.VoteUpdate.prototype.setOption = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.sync.v1.MsgVoteUpdates.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.sync.v1.MsgVoteUpdates.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.sync.v1.MsgVoteUpdates.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.sync.v1.MsgVoteUpdates} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.sync.v1.MsgVoteUpdates.toObject = function(includeInstance, msg) {
  var f, obj = {
    votesList: jspb.Message.toObjectList(msg.getVotesList(),
    proto.sgn.sync.v1.VoteUpdate.toObject, includeInstance),
    sender: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.sync.v1.MsgVoteUpdates}
 */
proto.sgn.sync.v1.MsgVoteUpdates.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.sync.v1.MsgVoteUpdates;
  return proto.sgn.sync.v1.MsgVoteUpdates.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.sync.v1.MsgVoteUpdates} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.sync.v1.MsgVoteUpdates}
 */
proto.sgn.sync.v1.MsgVoteUpdates.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.sync.v1.VoteUpdate;
      reader.readMessage(value,proto.sgn.sync.v1.VoteUpdate.deserializeBinaryFromReader);
      msg.addVotes(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSender(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.sync.v1.MsgVoteUpdates.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.sync.v1.MsgVoteUpdates.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.sync.v1.MsgVoteUpdates} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.sync.v1.MsgVoteUpdates.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getVotesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.sgn.sync.v1.VoteUpdate.serializeBinaryToWriter
    );
  }
  f = message.getSender();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * repeated VoteUpdate votes = 1;
 * @return {!Array<!proto.sgn.sync.v1.VoteUpdate>}
 */
proto.sgn.sync.v1.MsgVoteUpdates.prototype.getVotesList = function() {
  return /** @type{!Array<!proto.sgn.sync.v1.VoteUpdate>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.sync.v1.VoteUpdate, 1));
};


/**
 * @param {!Array<!proto.sgn.sync.v1.VoteUpdate>} value
 * @return {!proto.sgn.sync.v1.MsgVoteUpdates} returns this
*/
proto.sgn.sync.v1.MsgVoteUpdates.prototype.setVotesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.sgn.sync.v1.VoteUpdate=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.sync.v1.VoteUpdate}
 */
proto.sgn.sync.v1.MsgVoteUpdates.prototype.addVotes = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.sgn.sync.v1.VoteUpdate, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.sync.v1.MsgVoteUpdates} returns this
 */
proto.sgn.sync.v1.MsgVoteUpdates.prototype.clearVotesList = function() {
  return this.setVotesList([]);
};


/**
 * optional string sender = 2;
 * @return {string}
 */
proto.sgn.sync.v1.MsgVoteUpdates.prototype.getSender = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.sync.v1.MsgVoteUpdates} returns this
 */
proto.sgn.sync.v1.MsgVoteUpdates.prototype.setSender = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


goog.object.extend(exports, proto.sgn.sync.v1);