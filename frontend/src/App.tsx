import { useState } from 'react';
import { ConfigProvider, Layout, Button, Upload, Progress, Card, Typography, Space, Divider, Alert, Switch } from 'antd';
import { UploadOutlined, FileTextOutlined, GlobalOutlined, BellOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { UploadFile } from 'antd/es/upload/interface';
import logo from './assets/logo.jpg';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

function App() {
  const { t, i18n } = useTranslation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('zh');

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
    setCurrentLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleUpload = async (file: File) => {
    // 模拟上传进度
    setUploadProgress(0);
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          // 上传完成后播放提醒音
          playNotificationSound();
          // 开始分析
          startAnalysis();
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return false; // 阻止默认上传行为
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const analysisInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(analysisInterval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          // 分析完成后播放提醒音
          playNotificationSound();
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };

  const playNotificationSound = () => {
    // 使用浏览器内置音效
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const generateReport = () => {
    // 生成PDF报告的逻辑将在后续实现
    alert(t('report.generating'));
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#D32F2F',
          borderRadius: 8,
          fontSize: 14,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Header style={{ 
          background: '#ffffff', 
          padding: '0 50px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img src={logo} alt="China Comservice" style={{ height: '50px' }} />
            <div>
              <Title level={3} style={{ margin: 0, color: '#D32F2F' }}>CCS-Tender</Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('header.subtitle')}
              </Text>
            </div>
          </div>
          
          <Space size="large">
            <Button 
              type="text" 
              icon={<GlobalOutlined />}
              onClick={toggleLanguage}
              style={{ fontSize: '16px' }}
            >
              {currentLanguage === 'zh' ? 'English' : '中文'}
            </Button>
          </Space>
        </Header>

        <Content style={{ padding: '50px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card 
              style={{ 
                borderRadius: '16px', 
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                marginBottom: '30px'
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={2}>
                    <FileTextOutlined style={{ marginRight: '10px', color: '#D32F2F' }} />
                    {t('upload.title')}
                  </Title>
                  <Paragraph type="secondary">
                    {t('upload.description')}
                  </Paragraph>
                </div>

                <Upload.Dragger
                  name="file"
                  multiple={false}
                  fileList={fileList}
                  beforeUpload={handleUpload}
                  onChange={(info) => setFileList(info.fileList)}
                  style={{ 
                    padding: '40px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '12px'
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined style={{ color: '#ffffff', fontSize: '48px' }} />
                  </p>
                  <p className="ant-upload-text" style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold' }}>
                    {t('upload.dragText')}
                  </p>
                  <p className="ant-upload-hint" style={{ color: '#ffffff', opacity: 0.8 }}>
                    {t('upload.hint')}
                  </p>
                </Upload.Dragger>

                {uploadProgress > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card style={{ background: '#f0f2f5', borderRadius: '12px' }}>
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                          <Text strong>{t('progress.uploading')}</Text>
                          <Progress 
                            percent={uploadProgress} 
                            status={uploadProgress === 100 ? 'success' : 'active'}
                            strokeColor={{
                              '0%': '#108ee9',
                              '100%': '#87d068',
                            }}
                          />
                        </div>
                        
                        {uploadProgress === 100 && (
                          <>
                            <Divider />
                            <div>
                              <Text strong>{t('progress.analyzing')}</Text>
                              <Progress 
                                percent={analysisProgress} 
                                status={analysisProgress === 100 ? 'success' : 'active'}
                                strokeColor={{
                                  '0%': '#ff6b6b',
                                  '100%': '#4ecdc4',
                                }}
                              />
                            </div>
                          </>
                        )}
                      </Space>
                    </Card>
                  </motion.div>
                )}

                {analysisComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Alert
                      message={t('analysis.complete')}
                      description={t('analysis.completeDesc')}
                      type="success"
                      showIcon
                      icon={<BellOutlined />}
                      action={
                        <Button type="primary" size="large" onClick={generateReport}>
                          {t('report.download')}
                        </Button>
                      }
                    />
                  </motion.div>
                )}
              </Space>
            </Card>
          </motion.div>
        </Content>

        <Footer style={{ textAlign: 'center', background: '#ffffff', borderTop: '1px solid #f0f0f0' }}>
          <Space direction="vertical" size="small">
            <Text strong style={{ fontSize: '16px', color: '#D32F2F' }}>China Comservice</Text>
            <Text type="secondary">{t('footer.motto')}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              © 2025 CCS-Tender. All rights reserved.
            </Text>
          </Space>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
