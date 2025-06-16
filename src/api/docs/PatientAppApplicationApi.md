# PatientAppApplicationApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**helloWorld**](#helloworld) | **GET** / | |

# **helloWorld**
> string helloWorld()


### Example

```typescript
import {
    PatientAppApplicationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientAppApplicationApi(configuration);

const { status, data } = await apiInstance.helloWorld();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

