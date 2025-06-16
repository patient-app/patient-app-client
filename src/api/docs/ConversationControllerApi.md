# ConversationControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createConversation**](#createconversation) | **POST** /patients/conversations | |
|[**getAllMessages**](#getallmessages) | **GET** /patients/conversations/messages/{conversationId} | |
|[**nameConversationDTO**](#nameconversationdto) | **GET** /patients/conversations/{patientId} | |
|[**sendMessage**](#sendmessage) | **POST** /patients/conversations/messages/{conversationId} | |

# **createConversation**
> CreateConversationOutputDTO createConversation()


### Example

```typescript
import {
    ConversationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationControllerApi(configuration);

const { status, data } = await apiInstance.createConversation();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**CreateConversationOutputDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllMessages**
> CompleteConversationOutputDTO getAllMessages()


### Example

```typescript
import {
    ConversationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationControllerApi(configuration);

let conversationId: string; // (default to undefined)

const { status, data } = await apiInstance.getAllMessages(
    conversationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationId** | [**string**] |  | defaults to undefined|


### Return type

**CompleteConversationOutputDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **nameConversationDTO**
> Array<NameConversationOutputDTO> nameConversationDTO()


### Example

```typescript
import {
    ConversationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationControllerApi(configuration);

const { status, data } = await apiInstance.nameConversationDTO();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<NameConversationOutputDTO>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sendMessage**
> MessageOutputDTO sendMessage(createMessageDTO)


### Example

```typescript
import {
    ConversationControllerApi,
    Configuration,
    CreateMessageDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationControllerApi(configuration);

let conversationId: string; // (default to undefined)
let createMessageDTO: CreateMessageDTO; //

const { status, data } = await apiInstance.sendMessage(
    conversationId,
    createMessageDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createMessageDTO** | **CreateMessageDTO**|  | |
| **conversationId** | [**string**] |  | defaults to undefined|


### Return type

**MessageOutputDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

