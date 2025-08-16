import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px 0' }}>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <Link to="/demands">
            <Button type="primary">
              返回需求管理
            </Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFoundPage;