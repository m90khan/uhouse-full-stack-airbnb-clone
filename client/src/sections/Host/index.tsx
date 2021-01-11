import React, { useState, FormEvent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Layout,
  Radio,
  Typography,
  Upload,
} from 'antd';
// import { FormComponentProps } from 'antd/lib/form/Form';
import { UploadChangeParam } from 'antd/lib/upload';
import { HOST_LISTING } from '../../lib/graphql/mutations';
import {
  HostListing as HostListingData,
  HostListingVariables,
} from '../../lib/graphql/mutations/HostListing/__generated__/HostListing';
import { ListingType } from '../../lib/graphql/globalTypes';
import {
  iconColor,
  displaySuccessNotification,
  displayErrorMessage,
} from '../../lib/utils';
import { Viewer } from '../../lib/types';
import {
  HomeOutlined,
  LoadingOutlined,
  PlusOutlined,
  BankOutlined,
} from '@ant-design/icons';

interface Props {
  viewer: Viewer;
}

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;
export const Host = ({ viewer, form }: Props & any) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

  const [hostListing, { loading, data }] = useMutation<
    HostListingData,
    HostListingVariables
  >(HOST_LISTING, {
    onCompleted: () => {
      displaySuccessNotification("You've successfully created your listing!");
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to create your listing. Please try again later."
      );
    },
  });
  const handleImageUpload = (info: UploadChangeParam) => {
    // info object gives the status for the upload
    const { file } = info;

    if (file.status === 'uploading') {
      setImageLoading(true);
      return;
    }
    // if done is done upload and has property originFileBody which is the orifinal file object
    if (file.status === 'done' && file.originFileObj) {
      getBase64Value(file.originFileObj, (imageBase64Value) => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };
  const handleHostListing = (values: any) => {
    const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.postalCode}`;

    const input = {
      ...values,
      address: fullAddress,
      image: imageBase64Value,
      price: values.price * 100,
    };
    delete input.city;
    delete input.state;
    delete input.postalCode;

    hostListing({
      variables: {
        input,
      },
    });
  };
  const onFormFailed = (errorInfo: any) => {
    if (errorInfo) {
      displayErrorMessage('Please complete all required form fields!');
      return;
    }
  };

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className='host-content'>
        <div className='host__form-header'>
          <Title level={4} className='host__form-title'>
            You'll have to be signed in and connected with Stripe to host a listing!
          </Title>
          <Text type='secondary'>
            We only allow users who've signed in to our application and have connected
            with Stripe to host new listings. You can sign in at the{' '}
            <Link to='/login'>/login</Link> page and connect with Stripe shortly after.
          </Text>
        </div>
      </Content>
    );
  }
  if (loading) {
    return (
      <Content className='host-content'>
        <div className='host__form-header'>
          <Title level={3} className='host__form-title'>
            Please wait!
          </Title>
          <Text type='secondary'>We're creating your listing now.</Text>
        </div>
      </Content>
    );
  }

  if (data && data.hostListing) {
    return <Redirect to={`/listing/${data.hostListing.id}`} />;
  }

  // const { getFieldDecorator } = form;

  return (
    <Content className='host-content'>
      <Form layout='vertical' onFinish={handleHostListing} onFinishFailed={onFormFailed}>
        <div className='host__form-header'>
          <Title level={3} className='host__form-title'>
            Hi! Let's get started listing your place.
          </Title>
          <Text type='secondary'>
            In this form, we'll collect some basic and additional information about your
            listing.
          </Text>
        </div>

        <Item
          label='Home Type'
          name='Home Type'
          rules={[
            {
              required: true,
              message: 'Please choose property type for your listing!',
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <BankOutlined style={{ color: iconColor }} /> <span>Apartment</span>
              {/* <Icon type='bank' style={{ color: iconColor }} /> <span>Apartment</span> */}
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <HomeOutlined style={{ color: iconColor }} /> <span>House</span>
            </Radio.Button>
          </Radio.Group>
        </Item>

        <Item
          label='Max number of Guests'
          name='maxGuests'
          rules={[
            {
              required: true,
              message: 'Please enter max number of guests for your listing!',
            },
          ]}
        >
          <InputNumber min={1} placeholder='4' />
        </Item>

        <Item
          label='Title'
          extra='Max character count of 45'
          name='Title'
          rules={[
            {
              required: true,
              message: 'Please enter a title for your listing!',
            },
          ]}
        >
          <Input maxLength={45} placeholder='The iconic and luxurious Bel-Air mansion' />
        </Item>

        <Item
          label='Description of listing'
          extra='Max character count of 400'
          name='Description of listing'
          rules={[
            {
              required: true,
              message: 'Please enter a description for your listing!',
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            maxLength={400}
            placeholder='Modern, clean, and iconic home of the Fresh Prince. Situated in the heart of Bel-Air, Los Angeles.'
          />
        </Item>

        <Item
          label='Address'
          // name='Address'
          // rules={[
          //   {
          //     required: true,
          //     message: 'Please enter a address for your listing!',
          //   },
          // ]}
        >
          <Input placeholder='251 North Bristol Avenue' />
        </Item>

        <Item
          label='City/Town'
          name='City/Town'
          rules={[
            {
              required: true,
              message: 'Please enter a city (or region) for your listing!',
            },
          ]}
        >
          <Input placeholder='Los Angeles' />
        </Item>

        <Item
          label='State/Province'
          name='State/Province'
          rules={[
            {
              required: true,
              message: 'Please enter a state (or province) for your listing!',
            },
          ]}
        >
          <Input placeholder='California' />
        </Item>

        <Item
          label='Zip/Postal Code'
          name='Zip/Postal Code'
          rules={[
            {
              required: true,
              message: 'Please enter a zip (or postal) code for your listing!',
            },
          ]}
        >
          <Input placeholder='Please enter a zip code for your listing!' />
        </Item>

        <Item
          label='Image'
          name='Image'
          extra='Images have to be under 1MB in size and of type JPG or PNG'
        >
          <div className='host__form-image-upload'>
            <Upload
              name='image'
              listType='picture-card'
              showUploadList={false}
              // action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBase64Value ? (
                <img src={imageBase64Value} alt='Listing' />
              ) : (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  {/* <Icon type={imageLoading ? 'loading' : 'plus'} /> */}
                  <div className='ant-upload-text'>Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>

        <Item
          label='Price'
          name='Price'
          extra='All prices in $USD/day'
          rules={[
            {
              required: true,
              message: 'Please enter a price for your listing!',
            },
          ]}
        >
          <InputNumber min={0} placeholder='120' />
        </Item>

        <Item>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Item>
      </Form>
    </Content>
  );
};

// HOF for form wrapper : HoST component to wrap
// export const WrappedHost = Form.create<Props & FormComponentProps>({
//   name: 'host_form',
// })(Host);

const beforeImageUpload = (file: File) => {
  const fileIsValidImage = file.type === 'image/jpeg' || file.type === 'image/png';
  const fileIsValidSize = file.size / 1024 / 1024 < 1;

  if (!fileIsValidImage) {
    displayErrorMessage('You can only upload valid JPG or PNG files!');
    return false;
  }

  if (!fileIsValidSize) {
    displayErrorMessage('You can only upload valid image files of under 1MB in size!');
    return false;
  }

  return fileIsValidImage && fileIsValidSize;
};

const getBase64Value = (
  img: File | Blob, // uload image can rither be a file or file like blob
  callback: (imageBase64Value: string) => void
) => {
  /*
  FileReadeer allows to read blocks of a file
  */
  const reader = new FileReader();
  reader.readAsDataURL(img); // read the contents of the img file
  reader.onload = () => {
    callback(reader.result as string);
  };
};
