if(global.ErrorUtils)global.ErrorUtils.setGlobalHandler(()=>{});
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  Linking,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const COLORS = {
  bg: '#0B0B13',
  card: '#161624',
  primary: '#8B5CF6',
  accent: '#38BDF8',
  text: '#F8FAFC',
  muted: '#94A3B8',
  border: '#26263A',
  danger: '#EF4444',
};

export default function App() {
  const [user, setUser] = useState({name:"Misafir"});
  const [authMode, setAuthMode] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [smsSent, setSmsSent] = useState(false);

  const [activeTab, setActiveTab] = useState('scan');
  const [selectedImage, setSelectedImage] = useState({name:"Misafir"});
  const [scanResults, setScanResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isPremium, setIsPremium] = useState(false);

  const discoverPosts = [
    {
      id: '1',
      author: 'Selin K.',
      title: 'Sonbahar Trençkot & Bot Kombini',
      query: 'kadin bej trenckot',
      image: 'https://unsplash.com',
    },
    {
      id: '2',
      author: 'Mert D.',
      title: 'Sokak Stili Oversize Ceket',
      query: 'erkek siyah oversize ceket',
      image: 'https://unsplash.com',
    },
  ];

  const handleEmailLogin = () => {
    if (!email || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    setUser({ type: 'email', identifier: email });
  };

  const handlePhoneLogin = () => {
    if (!smsSent) {
      if (phone.length < 10) {
        Alert.alert('Hata', 'Geçerli bir telefon numarası girin.');
        return;
      }
      setSmsSent(true);
      Alert.alert('SMS Gönderildi', 'Telefonunuza gelen doğrulama kodunu girin.');
    } else {
      if (smsCode.length < 4) {
        Alert.alert('Hata', 'Doğrulama kodunu girin.');
        return;
      }
      setUser({ type: 'phone', identifier: phone });
    }
  };

  const handleGuestLogin = () => {
    setUser({ type: 'guest', identifier: 'Misafir Kullanıcı' });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Tüm tarama geçmişiniz, favorileriniz ve hesap verileriniz kalıcı olarak silinecektir. Onaylıyor musunuz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Kalıcı Olarak Sil',
          style: 'destructive',
          onPress: () => {
            setFavorites([]);
            setHistory([]);
            setUser(null);
            Alert.alert('Bilgi', 'Hesabınız ve tüm verileriniz silindi.');
          },
        },
      ]
    );
  };

  const analyzeFashionImage = (uri) => {
    setSelectedImage(uri);
    const mockMatches = [
      {
        id: Date.now().toString() + '_1',
        name: 'Siyah Deri Görünümlü Kısa Ceket',
        matchRate: '%96 Eşleşme',
        searchQuery: 'siyah deri ceket',
      },
      {
        id: Date.now().toString() + '_2',
        name: 'Yüksek Bel Geniş Paça Pantolon',
        matchRate: '%91 Eşleşme',
        searchQuery: 'yuksek bel genis paca pantolon',
      },
      {
        id: Date.now().toString() + '_3',
        name: 'Kalın Tabanlı Günlük Sneaker',
        matchRate: '%88 Eşleşme',
        searchQuery: 'kalin taban sneaker',
      },
    ];
    setScanResults(mockMatches);
    setHistory((prev) => [{ id: Date.now().toString(), uri, date: 'Bugün' }, ...prev]);
  };

  const pickFromGallery = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      analyzeFashionImage(res.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('İzin Gerekli', 'Fotoğraf çekmek için kamera izni vermelisiniz.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      analyzeFashionImage(res.assets[0].uri);
    }
  };

  const openTrendyolSearch = (query) => {
const url ='https://trendyol.com' + encodeURİComponent(query);
    Linking.openURL(url);
  };

  const toggleFavorite = (item) => {
    const exists = favorites.some((fav) => fav.id === item.id);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.id !== item.id));
    } else {
      setFavorites([item, ...favorites]);
      Alert.alert('Favorilere Eklendi', item.name);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
        <ScrollView contentContainerStyle={styles.authContainer}>
          <Text style={styles.brandTitle}>PEEKFOOT</Text>
          <Text style={styles.brandSubtitle}>Akıllı Moda & Görsel Alışveriş Lensi</Text>

          <View style={styles.tabSwitch}>
            <TouchableOpacity
              style={[styles.switchBtn, authMode === 'email' && styles.switchBtnActive]}
              onPress={() => setAuthMode('email')}
            >
              <Text style={styles.switchText}>E-posta ile Giriş</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.switchBtn, authMode === 'phone' && styles.switchBtnActive]}
              onPress={() => setAuthMode('phone')}
            >
              <Text style={styles.switchText}>Telefon (SMS)</Text>
            </TouchableOpacity>
          </View>

          {authMode === 'email' ? (
            <View style={styles.card}>
              <TextInput
                style={styles.input}
                placeholder="E-posta adresiniz"
                placeholderTextColor={COLORS.muted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Şifreniz"
                placeholderTextColor={COLORS.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity style={styles.primaryBtn} onPress={handleEmailLogin}>
                <Text style={styles.primaryBtnText}>Giriş Yap / Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <TextInput
                style={styles.input}
                placeholder="Telefon Numarası (5XX...)"
                placeholderTextColor={COLORS.muted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              {smsSent && (
                <TextInput
                  style={styles.input}
                  placeholder="SMS Doğrulama Kodu"
                  placeholderTextColor={COLORS.muted}
                  value={smsCode}
                  onChangeText={setSmsCode}
                  keyboardType="number-pad"
                />
              )}
              <TouchableOpacity style={styles.primaryBtn} onPress={handlePhoneLogin}>
                <Text style={styles.primaryBtnText}>
                  {smsSent ? 'Kodu Doğrula ve Gir' : 'SMS Kodu Gönder'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.guestBtn} onPress={handleGuestLogin}>
            <Text style={styles.guestBtnText}>Üye Olmadan Misafir Olarak Devam Et</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://google.com')
            }
          >
            <Text style={styles.privacyLink}>Gizlilik Politikası ve Kullanım Koşulları</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>PEEKFOOT</Text>
        <TouchableOpacity style={styles.proBadge} onPress={() => setActiveTab('profile')}>
          <Text style={styles.proBadgeText}>{isPremium ? 'PRO AKTİF' : 'PROYA GEÇ'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'scan' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Yapay Zeka Moda Lensi</Text>
              <Text style={styles.sectionDesc}>
                Beğendiğin kıyafet, ayakkabı veya aksesuarın fotoğrafını çek ya da galerinden seç.
              </Text>

              <View style={styles.row}>
                <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
                  <Text style={styles.actionBtnText}>Kamerayla Çek</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: COLORS.accent }]}
                  onPress={pickFromGallery}
                >
                  <Text style={[styles.actionBtnText, { color: '#0B0B13' }]}>Galeriden Seç</Text>
                </TouchableOpacity>
              </View>

              {selectedImage && (
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              )}
            </View>

            {!isPremium && (
<View style={styles.card}>
                <Text style={styles.sectionTitle}>Pro Üyeliğe Geç</Text>
                <Text style={styles.sectionDesc}>
                  Sınırsız tarama ve stil analizi için Pro plana geçebilirsin.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  proBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  proBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  sectionDesc: { color: COLORS.muted, fontSize: 14, lineHeight: 20, marginBottom: 16 },
  row: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  actionBtnSecondary: { backgroundColor: COLORS.border },
  actionBtnText: { color: COLORS.text, fontWeight: 'bold', fontSize: 14 },
  previewImg: { width: '100%', height: 220, borderRadius: 12, marginTop: 16 },
});
