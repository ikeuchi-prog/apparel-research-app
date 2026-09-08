"use client";
import { useState } from 'react';

export default function JapanPage() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      targetImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      cardImg: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      itemImgs: ['https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=800'],
      status: '報告あり'
    }
  ]);
  const [uploading, setUploading] = useState(false);

  // Vercel Blobへの画像アップロード処理
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      const newBlob = await response.json();

      // 新しいリサーチ依頼を追加
      setRequests([
        {
          id: Date.now(),
          targetImg: newBlob.url,
          cardImg: null,
          itemImgs: [],
          status: '現地リサーチ中'
        },
        ...requests
      ]);
      alert('リサーチ依頼を登録しました！中国側画面に反映されます。');
    } catch (err) {
      alert('アップロードに失敗しました。');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '20px' }}>日中アパレルリサーチ - 日本側管理画面</h1>
      
      {/* 新規登録エリア */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h2>＋ 探してほしい服の写真を登録</h2>
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ marginTop: '10px' }} />
        {uploading && <p style={{ color: '#0066cc' }}>画像をアップロード中...</p>}
      </div>

      {/* 一覧エリア */}
      <h2>依頼・報告一覧</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
        {requests.map((req) => (
          <div key={req.id} style={{ background: '#fff', padding: '16px', borderRadius: '8px', display: 'flex', gap: '20px' }}>
            <div style={{ width: '200px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold' }}>探す服 ({req.status})</p>
              <img src={req.targetImg} alt="依頼" style={{ width: '100%', borderRadius: '4px', marginTop: '4px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold' }}>現地報告結果</p>
              {req.cardImg ? (
                <div>
                  <p style={{ fontSize: '11px', color: '#666' }}>名刺:</p>
                  <img src={req.cardImg} alt="名刺" style={{ width: '120px', borderRadius: '4px' }} />
                  <p style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>商品写真:</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {req.itemImgs.map((img, idx) => (
                      <img key={idx} src={img} alt="商品" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ color: '#999', fontSize: '13px', marginTop: '20px' }}>現地担当者の確認・報告待ちです</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
