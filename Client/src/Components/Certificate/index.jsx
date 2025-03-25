import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderContainer: {
    position: 'relative',
    width: '100%',
    padding: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#B8860B',
    alignItems: 'center',
  },
  borderDecor: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 10,
    borderColor: '#2C3E50',
    top: 10,
    left: 10,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 24,
    color: '#34495E',
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    fontSize: 18,
    color: '#34495E',
    marginBottom: 10,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000000',
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 20,
  },
  signatureContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },
  signature: {
    width: 120,
    height: 50,
    marginBottom: 5,
  },
  footer: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 30,
    textAlign: 'center',
  },
});

const CourseCertificate = ({
  studentName,
  startDate,
  completionDate,
  courseTitle,
  userImage,
  websiteLogo,
  adminSignPhoto,
  marksObtained,
  total
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.borderContainer}>
        <View style={styles.borderDecor} />

        {websiteLogo && <Image src={websiteLogo} style={styles.logo} />}
        <Text style={styles.header}>CERTIFICATE</Text>
        <Text style={styles.subHeader}>Of Course Completion</Text>
        <Text style={styles.body}>This certificate is proudly presented to</Text>

        {userImage ? (
          <Image
            style={styles.userImage}
            src={userImage.startsWith('http') ? userImage : `${import.meta.env.VITE_BACKEND_URL}/${userImage}`}
          />
        ) : (
          <Text style={styles.boldText}>{studentName?.charAt(0).toUpperCase()}</Text>
        )}

        <Text style={styles.boldText}>{studentName}</Text>
        <Text style={styles.body}>For successfully completing the course</Text>
        <Text style={styles.boldText}>{courseTitle}</Text>
        <Text style={styles.body}>
          from {startDate} to {completionDate}
        </Text>
        <Text style={styles.body}>Issued Date: {moment().format('MMMM Do YYYY')}</Text>
        <Text style={styles.body}>Marks Obtained: {marksObtained}/{total}</Text>

        <View style={styles.signatureContainer}>
          {adminSignPhoto && <Image src={adminSignPhoto} style={styles.signature} />}
          <Text style={styles.body}>Administrator</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default CourseCertificate;
