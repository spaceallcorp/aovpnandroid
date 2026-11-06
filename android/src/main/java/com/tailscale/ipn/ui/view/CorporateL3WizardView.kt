// Copyright (c) Tailscale Inc & AUTHORS
// SPDX-License-Identifier: BSD-3-Clause

package com.tailscale.ipn.ui.view

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.outlined.Check
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.net.toUri
import com.tailscale.ipn.ui.theme.SpaceDarkBg
import com.tailscale.ipn.ui.theme.SpaceDarkBorder
import com.tailscale.ipn.ui.theme.SpaceDarkCard
import com.tailscale.ipn.ui.theme.SpaceDarkSurface
import com.tailscale.ipn.ui.theme.SpaceEmeraldContainer
import com.tailscale.ipn.ui.theme.SpaceEmeraldLight
import com.tailscale.ipn.ui.theme.SpaceEmeraldPrimary
import com.tailscale.ipn.ui.theme.SpaceTextPrimary
import com.tailscale.ipn.ui.theme.SpaceTextSecondary
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Composable
fun CorporateL3WizardView(onBack: () -> Unit, onDoneToExitNodes: () -> Unit) {
  var currentStep by remember { mutableIntStateOf(1) } // 1: Topology, 2: Industry, 3: Contact Form, 4: Success

  // State values
  var selectedTopology by remember { mutableStateOf("") }
  var selectedIndustry by remember { mutableStateOf("") }
  var contactName by remember { mutableStateOf("") }
  var companyName by remember { mutableStateOf("") }
  var corporateEmail by remember { mutableStateOf("") }
  var phoneWhatsApp by remember { mutableStateOf("") }

  val context = LocalContext.current
  val coroutineScope = rememberCoroutineScope()

  Scaffold(
      containerColor = SpaceDarkBg,
      topBar = {
        Row(
            modifier =
                Modifier.fillMaxWidth()
                    .padding(top = 40.dp, start = 16.dp, end = 16.dp, bottom = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween) {
              if (currentStep < 4) {
                IconButton(
                    onClick = {
                      if (currentStep > 1) currentStep-- else onBack()
                    }) {
                      Icon(
                          imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                          contentDescription = "Voltar",
                          tint = SpaceTextPrimary)
                    }
              } else {
                Spacer(modifier = Modifier.width(48.dp))
              }

              Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Interligação Privada",
                    style =
                        MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold, color = SpaceTextPrimary))
                if (currentStep < 4) {
                  Text(
                      text = "Passo $currentStep de 3",
                      style =
                          MaterialTheme.typography.bodySmall.copy(
                              color = SpaceEmeraldLight, fontWeight = FontWeight.Bold))
                }
              }

              Spacer(modifier = Modifier.width(48.dp))
            }
      }) { innerPadding ->
        Column(
            modifier =
                Modifier.fillMaxSize()
                    .padding(innerPadding)
                    .padding(horizontal = 24.dp)
                    .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally) {

              // Progress Bar
              if (currentStep < 4) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                      repeat(3) { stepIndex ->
                        val active = currentStep >= stepIndex + 1
                        Box(
                            modifier =
                                Modifier.weight(1f)
                                    .height(4.dp)
                                    .clip(CircleShape)
                                    .background(
                                        if (active) SpaceEmeraldPrimary else SpaceDarkBorder))
                      }
                    }
                Spacer(modifier = Modifier.height(16.dp))
              }

              AnimatedContent(
                  targetState = currentStep,
                  transitionSpec = { fadeIn() togetherWith fadeOut() },
                  label = "stepContent") { step ->
                    when (step) {
                      1 ->
                          Step1Topology(
                              selected = selectedTopology,
                              onSelect = { selectedTopology = it },
                              onNext = { if (selectedTopology.isNotEmpty()) currentStep = 2 })
                      2 ->
                          Step2Industry(
                              selected = selectedIndustry,
                              onSelect = { selectedIndustry = it },
                              onNext = { if (selectedIndustry.isNotEmpty()) currentStep = 3 })
                      3 ->
                          Step3DataForm(
                              name = contactName,
                              onNameChange = { contactName = it },
                              company = companyName,
                              onCompanyChange = { companyName = it },
                              email = corporateEmail,
                              onEmailChange = { corporateEmail = it },
                              phone = phoneWhatsApp,
                              onPhoneChange = { phoneWhatsApp = it },
                              onSubmit = {
                                coroutineScope.launch(Dispatchers.IO) {
                                  sendProposalEmail(
                                      context,
                                      selectedTopology,
                                      selectedIndustry,
                                      contactName,
                                      companyName,
                                      corporateEmail,
                                      phoneWhatsApp)
                                }
                                currentStep = 4
                              })
                      4 -> Step4Success(onFinish = onDoneToExitNodes)
                    }
                  }
            }
      }
}

@Composable
private fun Step1Topology(selected: String, onSelect: (String) -> Unit, onNext: () -> Unit) {
  val topologies =
      listOf(
          "Ponto A (Angola) ↔ Ponto B (no Estrangeiro)" to
              "Ligação dedicada internacional entre a matriz em Angola e nós externos.",
          "Escritório (On-Premise) ↔ Cloud (AWS, Azure, GCP, Alibaba Cloud, Clouds2Africa, etc.)" to
              "Conexão directa encriptada entre os seus servidores locais e na cloud.",
          "Ponto A (Angola) ↔ Ponto B (em Angola)" to
              "Interligação Privada L3 entre escritórios e filiais dentro do território nacional.")

  Column(modifier = Modifier.fillMaxWidth()) {
    Text(
        text = "Topologia de Ligação",
        style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold, color = SpaceTextPrimary))
    Spacer(modifier = Modifier.height(6.dp))
    Text(
        text = "Selecione a arquitetura de rede que a sua empresa pretende implementar:",
        style = MaterialTheme.typography.bodyMedium.copy(color = SpaceTextSecondary))

    Spacer(modifier = Modifier.height(24.dp))

    topologies.forEach { (title, description) ->
      val isSelected = selected == title
      Card(
          modifier =
              Modifier.fillMaxWidth()
                  .padding(vertical = 8.dp)
                  .border(
                      1.dp,
                      if (isSelected) SpaceEmeraldPrimary else SpaceDarkBorder,
                      RoundedCornerShape(16.dp))
                  .clickable { onSelect(title) },
          shape = RoundedCornerShape(16.dp),
          colors = CardDefaults.cardColors(containerColor = SpaceDarkCard)) {
            Row(
                modifier = Modifier.padding(20.dp),
                verticalAlignment = Alignment.CenterVertically) {
                  Box(
                      modifier =
                          Modifier.size(24.dp)
                              .clip(CircleShape)
                              .background(
                                  if (isSelected) SpaceEmeraldPrimary else SpaceDarkSurface)
                              .border(
                                  1.5.dp,
                                  if (isSelected) SpaceEmeraldPrimary else SpaceDarkBorder,
                                  CircleShape),
                      contentAlignment = Alignment.Center) {
                        if (isSelected) {
                          Icon(
                              imageVector = Icons.Outlined.Check,
                              contentDescription = null,
                              tint = SpaceDarkBg,
                              modifier = Modifier.size(16.dp))
                        }
                      }

                  Spacer(modifier = Modifier.width(16.dp))

                  Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = title,
                        style =
                            MaterialTheme.typography.titleSmall.copy(
                                fontWeight = FontWeight.Bold, color = SpaceTextPrimary))
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = description,
                        style =
                            MaterialTheme.typography.bodySmall.copy(
                                color = SpaceTextSecondary, lineHeight = 18.sp))
                  }
                }
          }
    }

    Spacer(modifier = Modifier.height(32.dp))

    Button(
        onClick = onNext,
        enabled = selected.isNotEmpty(),
        modifier = Modifier.fillMaxWidth().height(52.dp),
        shape = RoundedCornerShape(16.dp),
        colors = ButtonDefaults.buttonColors(containerColor = SpaceEmeraldPrimary)) {
          Text(
              text = "Continuar para Ramo de Atividade",
              style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
          Spacer(modifier = Modifier.width(8.dp))
          Icon(imageVector = Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null)
        }
  }
}

@Composable
private fun Step2Industry(selected: String, onSelect: (String) -> Unit, onNext: () -> Unit) {
  val industries =
      listOf(
          "Comércio & Retalho",
          "Provedor de Serviços",
          "Petróleo e Gás",
          "Escritório / Corporativo")

  Column(modifier = Modifier.fillMaxWidth()) {
    Text(
        text = "Segmento de Indústria",
        style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold, color = SpaceTextPrimary))
    Spacer(modifier = Modifier.height(6.dp))
    Text(
        text = "Indique o setor em que a sua organização opera para personalização do SLA:",
        style = MaterialTheme.typography.bodyMedium.copy(color = SpaceTextSecondary))

    Spacer(modifier = Modifier.height(24.dp))

    industries.forEach { industry ->
      val isSelected = selected == industry
      Card(
          modifier =
              Modifier.fillMaxWidth()
                  .padding(vertical = 6.dp)
                  .border(
                      1.dp,
                      if (isSelected) SpaceEmeraldPrimary else SpaceDarkBorder,
                      RoundedCornerShape(16.dp))
                  .clickable { onSelect(industry) },
          shape = RoundedCornerShape(16.dp),
          colors = CardDefaults.cardColors(containerColor = SpaceDarkCard)) {
            Row(
                modifier = Modifier.padding(20.dp),
                verticalAlignment = Alignment.CenterVertically) {
                  Box(
                      modifier =
                          Modifier.size(24.dp)
                              .clip(CircleShape)
                              .background(
                                  if (isSelected) SpaceEmeraldPrimary else SpaceDarkSurface)
                              .border(
                                  1.5.dp,
                                  if (isSelected) SpaceEmeraldPrimary else SpaceDarkBorder,
                                  CircleShape),
                      contentAlignment = Alignment.Center) {
                        if (isSelected) {
                          Icon(
                              imageVector = Icons.Outlined.Check,
                              contentDescription = null,
                              tint = SpaceDarkBg,
                              modifier = Modifier.size(16.dp))
                        }
                      }

                  Spacer(modifier = Modifier.width(16.dp))

                  Text(
                      text = industry,
                      style =
                          MaterialTheme.typography.titleSmall.copy(
                              fontWeight = FontWeight.Bold, color = SpaceTextPrimary))
                }
          }
    }

    Spacer(modifier = Modifier.height(32.dp))

    Button(
        onClick = onNext,
        enabled = selected.isNotEmpty(),
        modifier = Modifier.fillMaxWidth().height(52.dp),
        shape = RoundedCornerShape(16.dp),
        colors = ButtonDefaults.buttonColors(containerColor = SpaceEmeraldPrimary)) {
          Text(
              text = "Continuar para Dados de Contacto",
              style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
          Spacer(modifier = Modifier.width(8.dp))
          Icon(imageVector = Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null)
        }
  }
}

@Composable
private fun Step3DataForm(
    name: String,
    onNameChange: (String) -> Unit,
    company: String,
    onCompanyChange: (String) -> Unit,
    email: String,
    onEmailChange: (String) -> Unit,
    phone: String,
    onPhoneChange: (String) -> Unit,
    onSubmit: () -> Unit
) {
  val isValid =
      name.isNotBlank() && company.isNotBlank() && email.contains("@") && phone.isNotBlank()

  Column(modifier = Modifier.fillMaxWidth()) {
    Text(
        text = "Submissão de Dados Corporativos",
        style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold, color = SpaceTextPrimary))
    Spacer(modifier = Modifier.height(6.dp))
    Text(
        text = "Preencha os dados da empresa para receção da proposta de Interligação L3:",
        style = MaterialTheme.typography.bodyMedium.copy(color = SpaceTextSecondary))

    Spacer(modifier = Modifier.height(20.dp))

    OutlinedTextField(
        value = name,
        onValueChange = onNameChange,
        label = { Text("Nome do Responsável", color = SpaceTextSecondary) },
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors =
            OutlinedTextFieldDefaults.colors(
                focusedBorderColor = SpaceEmeraldPrimary,
                unfocusedBorderColor = SpaceDarkBorder,
                focusedContainerColor = SpaceDarkCard,
                unfocusedContainerColor = SpaceDarkCard,
                focusedTextColor = SpaceTextPrimary,
                unfocusedTextColor = SpaceTextPrimary))

    Spacer(modifier = Modifier.height(14.dp))

    OutlinedTextField(
        value = company,
        onValueChange = onCompanyChange,
        label = { Text("Nome da Empresa", color = SpaceTextSecondary) },
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors =
            OutlinedTextFieldDefaults.colors(
                focusedBorderColor = SpaceEmeraldPrimary,
                unfocusedBorderColor = SpaceDarkBorder,
                focusedContainerColor = SpaceDarkCard,
                unfocusedContainerColor = SpaceDarkCard,
                focusedTextColor = SpaceTextPrimary,
                unfocusedTextColor = SpaceTextPrimary))

    Spacer(modifier = Modifier.height(14.dp))

    OutlinedTextField(
        value = email,
        onValueChange = onEmailChange,
        label = { Text("E-mail Corporativo", color = SpaceTextSecondary) },
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors =
            OutlinedTextFieldDefaults.colors(
                focusedBorderColor = SpaceEmeraldPrimary,
                unfocusedBorderColor = SpaceDarkBorder,
                focusedContainerColor = SpaceDarkCard,
                unfocusedContainerColor = SpaceDarkCard,
                focusedTextColor = SpaceTextPrimary,
                unfocusedTextColor = SpaceTextPrimary))

    Spacer(modifier = Modifier.height(14.dp))

    OutlinedTextField(
        value = phone,
        onValueChange = onPhoneChange,
        label = { Text("Telefone / WhatsApp", color = SpaceTextSecondary) },
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors =
            OutlinedTextFieldDefaults.colors(
                focusedBorderColor = SpaceEmeraldPrimary,
                unfocusedBorderColor = SpaceDarkBorder,
                focusedContainerColor = SpaceDarkCard,
                unfocusedContainerColor = SpaceDarkCard,
                focusedTextColor = SpaceTextPrimary,
                unfocusedTextColor = SpaceTextPrimary))

    Spacer(modifier = Modifier.height(28.dp))

    Button(
        onClick = onSubmit,
        enabled = isValid,
        modifier = Modifier.fillMaxWidth().height(52.dp),
        shape = RoundedCornerShape(16.dp),
        colors = ButtonDefaults.buttonColors(containerColor = SpaceEmeraldPrimary)) {
          Text(
              text = "Submeter Pedido de Proposta L3",
              style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
        }
  }
}

@Composable
private fun Step4Success(onFinish: () -> Unit) {
  Column(
      modifier = Modifier.fillMaxWidth().padding(vertical = 32.dp),
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.Center) {
        Box(
            modifier =
                Modifier.size(80.dp)
                    .clip(CircleShape)
                    .background(SpaceEmeraldContainer)
                    .border(2.dp, SpaceEmeraldPrimary, CircleShape),
            contentAlignment = Alignment.Center) {
              Icon(
                  imageVector = Icons.Default.CheckCircle,
                  contentDescription = "Sucesso",
                  tint = SpaceEmeraldPrimary,
                  modifier = Modifier.size(48.dp))
            }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Conclua o envio da solicitação usando o seu serviço de e-mail principal. Após o envio com sucesso a nossa equipa de engenharia entrará em contacto.",
            style =
                MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold, color = SpaceTextPrimary),
            textAlign = androidx.compose.ui.text.style.TextAlign.Center)

        Spacer(modifier = Modifier.height(36.dp))

        Button(
            onClick = onFinish,
            modifier = Modifier.fillMaxWidth().height(52.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = SpaceEmeraldPrimary)) {
              Text(
                  text = "Voltar para o painel Principal",
                  style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
            }
      }
}

private fun sendProposalEmail(
    context: Context,
    topology: String,
    industry: String,
    name: String,
    company: String,
    email: String,
    phone: String
) {
  try {
    val subject = Uri.encode("[Proposta L3] $company - $name")
    val body =
        Uri.encode(
            """
        PROPOSTA DE INTERLIGAÇÃO PRIVADA L3 - SPACEALL
        
        Nome do Responsável: $name
        Empresa: $company
        E-mail Corporativo: $email
        Telefone / WhatsApp: $phone
        
        Topologia de Ligação: $topology
        Segmento de Indústria: $industry
        
        Enviado via AngolanVPN Enterprise App
      """.trimIndent())

    val uri = "mailto:contact@spaceall.net?subject=$subject&body=$body".toUri()
    val intent = Intent(Intent.ACTION_SENDTO, uri)
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    context.startActivity(intent)
  } catch (ignored: Exception) {
  }
}
