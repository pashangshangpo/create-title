import { useState, useEffect } from 'react'
import { Modal, Input, Button, Spin, message } from 'antd'
import { http } from '@tauri-apps/api'

import './Pay.less'

let checkTimer = null
const projcetName = 'create-title'

export const checkActive = () => {
  return localStorage.getItem(projcetName + '-err') || ''
}

export default (props) => {
  const [visible, setVisible] = useState(true)
  const [phone, setPhone] = useState('')
  const [price, setPrice] = useState(0)
  const [qrcode, setQrcode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initPrice()
  }, [])

  useEffect(() => {
    if (visible === false) {
      props.onClose && props.onClose()
    }
  }, [visible])

  const handleCancel = () => {
    setVisible(false)

    clearInterval(checkTimer)
  }

  const handleChangePhone = (event) => {
    setPhone(event.target.value.trim())
  }

  const handlePayBuy = async () => {
    clearInterval(checkTimer)

    if (phone.length === 0) {
      message.error('请输入手机号')
      return
    }

    setLoading(true)

    const res = await http.fetch('https://pay.jscs.top/api/qrcode', {
      method: 'POST',
      body: http.Body.json({
        name: projcetName,
        content: 'create-title ' + phone
      }),
      responseType: http.ResponseType.Text
    })

    const qrcode = res.data || ''

    setLoading(false)

    if (!qrcode) {
      return
    }

    setQrcode(qrcode)

    let checkCount = 1
    
    checkTimer = setInterval(() => {
      if (checkCount > 30) {
        clearInterval(checkTimer)
        setVisible(false)
        return
      }

      checkCount += 1

      checkPay()
    }, 1000 * 5)
  }

  const initPrice = async () => {
    const res = await http.fetch('https://pay.jscs.top/api/price', {
      method: 'POST',
      body: http.Body.json({
        name: projcetName,
      })
    })

    const price = res.data || ''

    setPrice(price || 0)
  }

  const checkPay = async () => {
    const res = await http.fetch('https://pay.jscs.top/api/check', {
      method: 'POST',
      body: http.Body.json({
        name: projcetName,
        content: 'create-title ' + phone
      }),
      responseType: http.ResponseType.Text
    })

    const appCode = res.data || ''

    if (!appCode) {
      return
    }

    clearInterval(checkTimer)

    await activeApp(appCode)
  }

  const activeApp = async (appCode) => {
    const res = await http.fetch('https://code.jscs.top/api/code', {
      method: 'POST',
      body: http.Body.json({
        name: projcetName,
        mac: phone,
        key: appCode
      })
    })

    const data = res.data || {}

    if (!data.success) {
      message.error('自动激活失败，如已付款请联系作者。')
    } else {
      message.success(data.message)

      localStorage.setItem(projcetName + '-err', 'errorcode')
    }

    setVisible(false)
  }

  const renderContent = () => {
    if (qrcode || loading) {
      return (
        <div className='pay-code'>
          <h2>微信或支付宝扫码支付</h2>
          {loading ? <Spin className='loading' tip='付款码获取中...' /> : <img src={qrcode} />}
        </div>
      )
    }

    return (
      <>
        <div className='item'>
          <label>手机号: </label>
          <Input placeholder='请输入您的手机号' onChange={handleChangePhone} />
        </div>
        <div className='item'>
          <label>微信或支付宝扫码支付后激活软件</label>
          <Button danger className='pay-button' onClick={handlePayBuy}>扫码支付(￥{price})</Button>
        </div>
      </>
    )
  }

  if (!visible) {
    return null
  }

  return (
    <Modal
      visible={true}
      title={<span style={{ textAlign: 'center', display: 'block', fontSize: '18px' }}>软件激活</span>}
      closable={false}
      centered={true}
      okText={'确认'}
      cancelText={'取消'}
      confirmLoading={false}
      onCancel={handleCancel}
      onOk={handlePayBuy}
    >
      <div className='active-modal'>
        {renderContent()}
      </div>
    </Modal>
  )
}
