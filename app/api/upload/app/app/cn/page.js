"use client";
import { useState } from 'react';

export default function ChinaPage() {
  const [uploading, setUploading] = useState(false);
  const [cardImg, setCardImg] = useState(null);
  const [itemImgs, setItemImgs] = useState([]);

  // カメラ写真のアップロード処理
  const handlePhotoCapture = async (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        });
        const blob = await res.json();

        if (type === 'card') {
          setCardImg(blob.url);
        } else {
          setItemImgs((prev) => [...prev, blob.url]);
        }
      }
    } catch (err) {
      alert('写真の送信に失敗しました');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ background: '#111', color: '#fff', minHeight: '100vh', padding: '16px', textAlign: 'center' }}>
      <h3 style={{ margin: '10px 0' }}>店舗確認用画面</h3>
      
      {/* 探す服の全画面イメージ表示 */}
      <div style={{ height: '50vh', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800" 
          alt="探す服" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
        />
      </div>

      <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>
        <h4>1. 名刺を撮影</h4>
        <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoCapture(e, 'card')} />
        {cardImg && <p style={{ color: '#4caf50', fontSize: '12px' }}>✓ 名刺撮影完了</p>}

        <h4 style={{ marginTop: '20px' }}>2. 服を撮影（複数可）</h4>
        <input type="file" accept="image/*" capture="environment" multiple onChange={(e) => handlePhotoCapture(e, 'item')} />
        <p style={{ fontSize: '12px', color: '#aaa' }}>撮影済み: {itemImgs.length}枚</p>

        {uploading && <p style={{ color: '#2196f3' }}>写真をアップロード中...</p>}

        <button 
          onClick={() => alert('日本側へ送信が完了しました！')}
          style={{ marginTop: '20px', width: '100%', padding: '14px', background: '#2196f3', color: '#fff', border: 'none', borderRadius: '25px', fontWeight: 'bold' }}
        >
          日本へ報告送信
        </button>
      </div>
    </div>
  );
}
