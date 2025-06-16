# PatientControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getCurrentlyLoggedInPatient**](#getcurrentlyloggedinpatient) | **GET** /patients/me | |
|[**getLanguage**](#getlanguage) | **GET** /patients/language | |
|[**getOnboarded**](#getonboarded) | **GET** /patients/onboarded | |
|[**loginTherapist**](#logintherapist) | **POST** /patients/login | |
|[**logoutTherapist**](#logouttherapist) | **POST** /patients/logout | |
|[**registerPatient**](#registerpatient) | **POST** /patients/register | |
|[**setLanguage**](#setlanguage) | **PUT** /patients/language | |
|[**setOnboarded**](#setonboarded) | **PUT** /patients/onboarded | |

# **getCurrentlyLoggedInPatient**
> PatientOutputDTO getCurrentlyLoggedInPatient()


### Example

```typescript
import {
    PatientControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientControllerApi(configuration);

const { status, data } = await apiInstance.getCurrentlyLoggedInPatient();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**PatientOutputDTO**

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

# **getLanguage**
> PatientOutputDTO getLanguage()


### Example

```typescript
import {
    PatientControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientControllerApi(configuration);

const { status, data } = await apiInstance.getLanguage();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**PatientOutputDTO**

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

# **getOnboarded**
> PatientOutputDTO getOnboarded()


### Example

```typescript
import {
    PatientControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientControllerApi(configuration);

const { status, data } = await apiInstance.getOnboarded();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**PatientOutputDTO**

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

# **loginTherapist**
> PatientOutputDTO loginTherapist(loginPatientDTO)


### Example

```typescript
import {
    PatientControllerApi,
    Configuration,
    LoginPatientDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientControllerApi(configuration);

let loginPatientDTO: LoginPatientDTO; //

const { status, data } = await apiInstance.loginTherapist(
    loginPatientDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginPatientDTO** | **LoginPatientDTO**|  | |


### Return type

**PatientOutputDTO**

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

# **logoutTherapist**
> logoutTherapist()


### Example

```typescript
import {
    PatientControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientControllerApi(configuration);

const { status, data } = await apiInstance.logoutTherapist();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerPatient**
> PatientOutputDTO registerPatient(createPatientDTO)


### Example

```typescript
import {
    PatientControllerApi,
    Configuration,
    CreatePatientDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientControllerApi(configuration);

let createPatientDTO: CreatePatientDTO; //

const { status, data } = await apiInstance.registerPatient(
    createPatientDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPatientDTO** | **CreatePatientDTO**|  | |


### Return type

**PatientOutputDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setLanguage**
> setLanguage(putLanguageDTO)


### Example

```typescript
import {
    PatientControllerApi,
    Configuration,
    PutLanguageDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientControllerApi(configuration);

let putLanguageDTO: PutLanguageDTO; //

const { status, data } = await apiInstance.setLanguage(
    putLanguageDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **putLanguageDTO** | **PutLanguageDTO**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setOnboarded**
> setOnboarded(putOnboardedDTO)


### Example

```typescript
import {
    PatientControllerApi,
    Configuration,
    PutOnboardedDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientControllerApi(configuration);

let putOnboardedDTO: PutOnboardedDTO; //

const { status, data } = await apiInstance.setOnboarded(
    putOnboardedDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **putOnboardedDTO** | **PutOnboardedDTO**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

